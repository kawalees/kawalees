import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.SESSION_SECRET || "kawalees-dev-secret-2024";
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: number; type: string; plan: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: number; type: string; plan: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; type: string; plan: string };
  } catch {
    return null;
  }
}

export interface AuthRequest extends Request {
  user?: { userId: number; type: string; plan: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "unauthorized", message: "Authentication required" });
    return;
  }
  const token = auth.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "unauthorized", message: "Invalid or expired token" });
    return;
  }
  req.user = payload;
  next();
}

export function requireArtist(req: AuthRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.type !== "artist") {
      res.status(403).json({ error: "forbidden", message: "Artist access required" });
      return;
    }
    next();
  });
}

export function requireCompany(req: AuthRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.type !== "company") {
      res.status(403).json({ error: "forbidden", message: "Company access required" });
      return;
    }
    next();
  });
}

// Plan limits for artists
export const PLAN_LIMITS = {
  free: { maxApplications: 3 },
  pro: { maxApplications: Infinity },
  elite: { maxApplications: Infinity },
} as const;
