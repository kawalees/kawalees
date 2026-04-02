import { Router } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken, requireAuth, type AuthRequest } from "../lib/auth";

const router = Router();

const registerSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل"),
  name: z.string().min(2, "الاسم مطلوب"),
  type: z.enum(["artist", "company", "group"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const body = registerSchema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "validation_error", message: body.error.issues[0]?.message ?? "بيانات غير صحيحة" });
      return;
    }
    const { email, password, name, type } = body.data;

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing) {
      res.status(409).json({ error: "conflict", message: "البريد الإلكتروني مستخدم بالفعل" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(usersTable)
      .values({ email: email.toLowerCase(), passwordHash, name, type, plan: "free" })
      .returning();

    const token = signToken({ userId: user.id, type: user.type, plan: user.plan });
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, type: user.type, plan: user.plan },
    });
  } catch (err) {
    req.log.error({ err }, "Register failed");
    res.status(500).json({ error: "internal_error", message: "فشل إنشاء الحساب" });
  }
});

// POST /auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "validation_error", message: "بيانات غير صحيحة" });
      return;
    }
    const { email, password } = body.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ error: "invalid_credentials", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      return;
    }

    const token = signToken({ userId: user.id, type: user.type, plan: user.plan });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, type: user.type, plan: user.plan },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "internal_error", message: "فشل تسجيل الدخول" });
  }
});

// PATCH /auth/change-password
router.patch("/auth/change-password", requireAuth, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
      newPassword: z.string().min(6, "كلمة المرور الجديدة 6 أحرف على الأقل"),
    });
    const body = schema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "validation_error", message: body.error.issues[0]?.message });
      return;
    }
    const { currentPassword, newPassword } = body.data;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "not_found", message: "المستخدم غير موجود" });
      return;
    }
    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      res.status(401).json({ error: "invalid_password", message: "كلمة المرور الحالية غير صحيحة" });
      return;
    }
    const newHash = await hashPassword(newPassword);
    await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.id, user.id));
    res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    req.log.error({ err }, "Change password failed");
    res.status(500).json({ error: "internal_error", message: "فشل تغيير كلمة المرور" });
  }
});

// PATCH /auth/update-name
router.patch("/auth/update-name", requireAuth, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({ name: z.string().min(2, "الاسم مطلوب") });
    const body = schema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "validation_error", message: body.error.issues[0]?.message });
      return;
    }
    const [updated] = await db.update(usersTable).set({ name: body.data.name })
      .where(eq(usersTable.id, req.user!.userId)).returning();
    res.json({ success: true, name: updated.name });
  } catch (err) {
    req.log.error({ err }, "Update name failed");
    res.status(500).json({ error: "internal_error", message: "فشل تحديث الاسم" });
  }
});

// GET /auth/me
router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "not_found", message: "المستخدم غير موجود" });
      return;
    }
    res.json({ id: user.id, email: user.email, name: user.name, type: user.type, plan: user.plan });
  } catch (err) {
    req.log.error({ err }, "Get me failed");
    res.status(500).json({ error: "internal_error", message: "فشل جلب بيانات المستخدم" });
  }
});

export default router;
