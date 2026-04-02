import { Router } from "express";
import { z } from "zod";
import { db, projectsTable, applicationsTable, usersTable } from "@workspace/db";
import { eq, desc, count, and } from "drizzle-orm";
import { requireArtist, requireCompany, PLAN_LIMITS, type AuthRequest, requireAuth } from "../lib/auth";

const router = Router();

const createProjectSchema = z.object({
  title: z.string().min(3, "العنوان 3 أحرف على الأقل"),
  description: z.string().min(10, "الوصف 10 أحرف على الأقل"),
  type: z.enum(["normal", "featured"]).default("normal"),
});

// GET /projects — public listing with applicant counts + optional search/filter
router.get("/projects", async (req, res) => {
  try {
    const { search, type } = req.query as { search?: string; type?: string };

    const projectsRaw = await db
      .select({
        id: projectsTable.id,
        title: projectsTable.title,
        description: projectsTable.description,
        type: projectsTable.type,
        createdAt: projectsTable.createdAt,
        companyId: projectsTable.companyId,
        companyName: usersTable.name,
      })
      .from(projectsTable)
      .leftJoin(usersTable, eq(projectsTable.companyId, usersTable.id))
      .orderBy(desc(projectsTable.createdAt));

    // Apply search/type filters (in-memory for simplicity)
    let filtered = projectsRaw;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          (p.companyName && p.companyName.toLowerCase().includes(s))
      );
    }
    if (type && (type === "normal" || type === "featured")) {
      filtered = filtered.filter((p) => p.type === type);
    }

    // Attach applicant count to each project
    const projects = await Promise.all(
      filtered.map(async (p) => {
        const [{ appCount }] = await db
          .select({ appCount: count() })
          .from(applicationsTable)
          .where(eq(applicationsTable.projectId, p.id));
        return { ...p, applicantCount: Number(appCount) };
      })
    );

    res.json(projects);
  } catch (err) {
    req.log.error({ err }, "Get projects failed");
    res.status(500).json({ error: "internal_error", message: "فشل جلب المشاريع" });
  }
});

// GET /projects/:id — project detail with applicant count
router.get("/projects/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "bad_request", message: "معرف غير صحيح" });
      return;
    }

    const [project] = await db
      .select({
        id: projectsTable.id,
        title: projectsTable.title,
        description: projectsTable.description,
        type: projectsTable.type,
        createdAt: projectsTable.createdAt,
        companyId: projectsTable.companyId,
        companyName: usersTable.name,
      })
      .from(projectsTable)
      .leftJoin(usersTable, eq(projectsTable.companyId, usersTable.id))
      .where(eq(projectsTable.id, id));

    if (!project) {
      res.status(404).json({ error: "not_found", message: "المشروع غير موجود" });
      return;
    }

    const [{ applicantCount }] = await db
      .select({ applicantCount: count() })
      .from(applicationsTable)
      .where(eq(applicationsTable.projectId, id));

    res.json({ ...project, applicantCount });
  } catch (err) {
    req.log.error({ err }, "Get project failed");
    res.status(500).json({ error: "internal_error", message: "فشل جلب المشروع" });
  }
});

// POST /projects — company creates project
router.post("/projects", requireCompany, async (req: AuthRequest, res) => {
  try {
    const body = createProjectSchema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "validation_error", message: body.error.issues[0]?.message ?? "بيانات غير صحيحة" });
      return;
    }

    const [project] = await db
      .insert(projectsTable)
      .values({ ...body.data, companyId: req.user!.userId })
      .returning();

    res.status(201).json(project);
  } catch (err) {
    req.log.error({ err }, "Create project failed");
    res.status(500).json({ error: "internal_error", message: "فشل إنشاء المشروع" });
  }
});

// DELETE /projects/:id — company deletes own project
router.delete("/projects/:id", requireCompany, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
    if (!project || project.companyId !== req.user!.userId) {
      res.status(403).json({ error: "forbidden", message: "لا يمكنك حذف هذا المشروع" });
      return;
    }
    await db.delete(applicationsTable).where(eq(applicationsTable.projectId, id));
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete project failed");
    res.status(500).json({ error: "internal_error", message: "فشل حذف المشروع" });
  }
});

// POST /projects/:id/apply — artist applies
router.post("/projects/:id/apply", requireArtist, async (req: AuthRequest, res) => {
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      res.status(400).json({ error: "bad_request", message: "معرف غير صحيح" });
      return;
    }

    const artistUserId = req.user!.userId;
    const plan = req.user!.plan as keyof typeof PLAN_LIMITS;

    // Verify project exists
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId)).limit(1);
    if (!project) {
      res.status(404).json({ error: "not_found", message: "المشروع غير موجود" });
      return;
    }

    // Check duplicate application
    const [alreadyApplied] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.artistUserId, artistUserId), eq(applicationsTable.projectId, projectId)))
      .limit(1);

    if (alreadyApplied) {
      res.status(409).json({ error: "conflict", message: "لقد تقدمت لهذا المشروع سابقاً" });
      return;
    }

    // Enforce plan limits
    const limit = PLAN_LIMITS[plan]?.maxApplications ?? 3;
    if (limit !== Infinity) {
      const [{ appCount }] = await db
        .select({ appCount: count() })
        .from(applicationsTable)
        .where(eq(applicationsTable.artistUserId, artistUserId));
      if (appCount >= limit) {
        res.status(403).json({
          error: "plan_limit",
          message: `وصلت إلى الحد الأقصى للخطة المجانية (${limit} طلبات). قم بالترقية للوصول الكامل.`,
        });
        return;
      }
    }

    const message = typeof req.body.message === "string" ? req.body.message : undefined;
    const [application] = await db
      .insert(applicationsTable)
      .values({ artistUserId, projectId, message: message || null })
      .returning();

    res.status(201).json({ success: true, application });
  } catch (err) {
    req.log.error({ err }, "Apply failed");
    res.status(500).json({ error: "internal_error", message: "فشل إرسال الطلب" });
  }
});

// GET /projects/:id/applicants — company views applicants
router.get("/projects/:id/applicants", requireCompany, async (req: AuthRequest, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId)).limit(1);
    if (!project || project.companyId !== req.user!.userId) {
      res.status(403).json({ error: "forbidden", message: "لا يمكنك الوصول لهذا المشروع" });
      return;
    }

    const applicants = await db
      .select({
        applicationId: applicationsTable.id,
        message: applicationsTable.message,
        appliedAt: applicationsTable.createdAt,
        artistId: usersTable.id,
        artistName: usersTable.name,
        artistEmail: usersTable.email,
        artistPlan: usersTable.plan,
      })
      .from(applicationsTable)
      .leftJoin(usersTable, eq(applicationsTable.artistUserId, usersTable.id))
      .where(eq(applicationsTable.projectId, projectId))
      .orderBy(desc(applicationsTable.createdAt));

    res.json(applicants);
  } catch (err) {
    req.log.error({ err }, "Get applicants failed");
    res.status(500).json({ error: "internal_error", message: "فشل جلب المتقدمين" });
  }
});

// GET /my-applications — artist checks their own applications
router.get("/my-applications", requireArtist, async (req: AuthRequest, res) => {
  try {
    const artistUserId = req.user!.userId;
    const apps = await db
      .select({
        applicationId: applicationsTable.id,
        message: applicationsTable.message,
        appliedAt: applicationsTable.createdAt,
        projectId: projectsTable.id,
        projectTitle: projectsTable.title,
        projectType: projectsTable.type,
        companyName: usersTable.name,
      })
      .from(applicationsTable)
      .leftJoin(projectsTable, eq(applicationsTable.projectId, projectsTable.id))
      .leftJoin(usersTable, eq(projectsTable.companyId, usersTable.id))
      .where(eq(applicationsTable.artistUserId, artistUserId))
      .orderBy(desc(applicationsTable.createdAt));
    res.json(apps);
  } catch (err) {
    req.log.error({ err }, "Get my-applications failed");
    res.status(500).json({ error: "internal_error", message: "فشل جلب طلباتك" });
  }
});

export default router;
