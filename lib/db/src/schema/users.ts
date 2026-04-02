import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  type: text("type").notNull(), // 'artist' | 'company'
  plan: text("plan").notNull().default("free"), // 'free' | 'pro' | 'elite'
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => usersTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull().default("normal"), // 'normal' | 'featured'
  createdAt: timestamp("created_at").defaultNow(),
});

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  artistUserId: integer("artist_user_id").notNull().references(() => usersTable.id),
  projectId: integer("project_id").notNull().references(() => projectsTable.id),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
