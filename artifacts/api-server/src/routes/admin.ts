import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { artistsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendEmail, approvalEmailHtml, rejectionEmailHtml } from "../lib/email";

const router: IRouter = Router();

const ADMIN_KEY = process.env.ADMIN_KEY || "kawalees-admin-2024";

function requireAdminKey(req: any, res: any, next: any) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: "unauthorized", message: "مفتاح الإدارة غير صحيح" });
  }
  next();
}

function mapArtist(a: typeof artistsTable.$inferSelect) {
  return {
    id: a.id,
    name: a.name,
    specialty: a.specialty,
    country: a.country,
    city: a.city ?? undefined,
    experience: a.experience,
    bio: a.bio ?? undefined,
    education: a.education ?? undefined,
    imageUrl: a.imageUrl ?? undefined,
    portfolioLinks: a.portfolioLinks ?? undefined,
    works: a.works ?? undefined,
    email: a.email ?? undefined,
    phone: a.phone ?? undefined,
    gender: a.gender ?? undefined,
    dateOfBirth: a.dateOfBirth ?? undefined,
    workTypes: a.workTypes ?? undefined,
    languages: a.languages ?? undefined,
    dialects: a.dialects ?? undefined,
    featured: a.featured,
    approved: a.approved,
    createdAt: a.createdAt,
  };
}

router.get("/admin/applications", requireAdminKey, async (req, res) => {
  try {
    const pending = await db
      .select()
      .from(artistsTable)
      .where(eq(artistsTable.approved, false))
      .orderBy(artistsTable.createdAt);

    res.json(pending.map(mapArtist));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch pending applications");
    res.status(500).json({ error: "internal_error", message: "حدث خطأ في الخادم" });
  }
});

router.patch("/admin/applications/:id/approve", requireAdminKey, async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await db
      .update(artistsTable)
      .set({ approved: true })
      .where(eq(artistsTable.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "not_found", message: "الطلب غير موجود" });
    }

    if (updated.email) {
      await sendEmail({
        to: updated.email,
        subject: "تمت الموافقة على ملفك في كواليس",
        html: approvalEmailHtml(updated.name),
      });
    }

    res.json({ success: true, message: "تمت الموافقة على الفنان بنجاح" });
  } catch (err) {
    req.log.error({ err }, "Failed to approve artist");
    res.status(500).json({ error: "internal_error", message: "حدث خطأ في الخادم" });
  }
});

router.delete("/admin/applications/:id", requireAdminKey, async (req, res) => {
  try {
    const { id } = req.params;

    const [toDelete] = await db
      .select()
      .from(artistsTable)
      .where(eq(artistsTable.id, id));

    if (!toDelete) {
      return res.status(404).json({ error: "not_found", message: "الطلب غير موجود" });
    }

    await db.delete(artistsTable).where(eq(artistsTable.id, id));

    if (toDelete.email) {
      await sendEmail({
        to: toDelete.email,
        subject: "بشأن طلب انضمامك لكواليس",
        html: rejectionEmailHtml(toDelete.name),
      });
    }

    res.json({ success: true, message: "تم رفض الطلب وحذفه" });
  } catch (err) {
    req.log.error({ err }, "Failed to reject artist application");
    res.status(500).json({ error: "internal_error", message: "حدث خطأ في الخادم" });
  }
});

router.get("/admin/artists", requireAdminKey, async (req, res) => {
  try {
    const artists = await db
      .select()
      .from(artistsTable)
      .where(eq(artistsTable.approved, true))
      .orderBy(artistsTable.createdAt);

    res.json(artists.map(mapArtist));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch approved artists");
    res.status(500).json({ error: "internal_error", message: "حدث خطأ في الخادم" });
  }
});

const UpdateArtistBody = z.object({
  name: z.string().min(2).optional(),
  specialty: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  city: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  education: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  works: z.string().optional(),
  portfolioLinks: z.string().optional(),
  featured: z.boolean().optional(),
});

router.patch("/admin/artists/:id", requireAdminKey, async (req, res) => {
  try {
    const { id } = req.params;
    const body = UpdateArtistBody.parse(req.body);

    const [updated] = await db
      .update(artistsTable)
      .set({ ...body })
      .where(eq(artistsTable.id, id))
      .returning({ id: artistsTable.id });

    if (!updated) {
      return res.status(404).json({ error: "not_found", message: "الفنان غير موجود" });
    }

    res.json({ success: true, message: "تم تحديث بيانات الفنان" });
  } catch (err) {
    req.log.error({ err }, "Failed to update artist");
    res.status(500).json({ error: "internal_error", message: "حدث خطأ في الخادم" });
  }
});

router.delete("/admin/artists/:id", requireAdminKey, async (req, res) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(artistsTable)
      .where(eq(artistsTable.id, id))
      .returning({ id: artistsTable.id });

    if (!deleted) {
      return res.status(404).json({ error: "not_found", message: "الفنان غير موجود" });
    }

    res.json({ success: true, message: "تم حذف الفنان من الدليل" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete artist");
    res.status(500).json({ error: "internal_error", message: "حدث خطأ في الخادم" });
  }
});

export default router;
