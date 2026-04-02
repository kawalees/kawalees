import { Router } from "express";
import { db, projectsTable, applicationsTable, usersTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../lib/auth";

const router = Router();

// GET /dashboard — redirects to artist or company dashboard data
router.get("/dashboard", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const userType = req.user!.type;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (userType === "artist") {
      // Artist: my applications
      const applications = await db
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
        .where(eq(applicationsTable.artistUserId, userId))
        .orderBy(desc(applicationsTable.createdAt));

      res.json({
        type: "artist",
        user: { id: user?.id, name: user?.name, email: user?.email, plan: user?.plan },
        applications,
        stats: { totalApplications: applications.length },
      });
    } else {
      // Company: my projects with applicant counts
      const projectsRaw = await db
        .select({
          id: projectsTable.id,
          title: projectsTable.title,
          description: projectsTable.description,
          type: projectsTable.type,
          createdAt: projectsTable.createdAt,
        })
        .from(projectsTable)
        .where(eq(projectsTable.companyId, userId))
        .orderBy(desc(projectsTable.createdAt));

      const projects = await Promise.all(
        projectsRaw.map(async (p) => {
          const [{ appCount }] = await db
            .select({ appCount: count() })
            .from(applicationsTable)
            .where(eq(applicationsTable.projectId, p.id));
          return { ...p, applicantCount: Number(appCount) };
        })
      );

      res.json({
        type: "company",
        user: { id: user?.id, name: user?.name, email: user?.email, plan: user?.plan },
        projects,
        stats: {
          totalProjects: projects.length,
          totalApplicants: projects.reduce((s, p) => s + p.applicantCount, 0),
        },
      });
    }
  } catch (err) {
    req.log.error({ err }, "Dashboard failed");
    res.status(500).json({ error: "internal_error", message: "فشل جلب لوحة التحكم" });
  }
});

export default router;
