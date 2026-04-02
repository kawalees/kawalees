import { pgTable, text, boolean, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const artistsTable = pgTable("artists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  country: text("country").notNull(),
  city: text("city"),
  experience: text("experience").notNull(),
  bio: text("bio"),
  education: text("education"),
  imageUrl: text("image_url"),
  portfolioLinks: text("portfolio_links"),
  works: text("works"),
  email: text("email"),
  phone: text("phone"),
  // New extended fields
  gender: text("gender"),
  dateOfBirth: text("date_of_birth"),
  workTypes: text("work_types"),
  languages: text("languages"),
  dialects: text("dialects"),
  approved: boolean("approved").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArtistSchema = createInsertSchema(artistsTable).omit({
  createdAt: true,
});
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artistsTable.$inferSelect;

export const contactRequestsTable = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  artistId: text("artist_id").notNull().references(() => artistsTable.id),
  requesterName: text("requester_name").notNull(),
  company: text("company"),
  projectType: text("project_type").notNull(),
  budget: text("budget"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactRequestSchema = createInsertSchema(contactRequestsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type ContactRequest = typeof contactRequestsTable.$inferSelect;
