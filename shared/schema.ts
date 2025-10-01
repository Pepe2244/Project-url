import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const urls = pgTable("urls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 10 }).notNull().unique(),
  originalUrl: text("original_url").notNull(),
  clicks: integer("clicks").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const clicks = pgTable("clicks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  urlId: varchar("url_id").notNull().references(() => urls.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUrlSchema = createInsertSchema(urls, {
  originalUrl: z.string().url("Invalid URL format"),
  code: z.string().regex(/^[a-zA-Z0-9]{5,10}$/, "Code must be 5-10 alphanumeric characters").optional(),
  expiresAt: z.string().optional(),
}).omit({
  id: true,
  clicks: true,
  createdAt: true,
});

export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type Url = typeof urls.$inferSelect;
export type Click = typeof clicks.$inferSelect;
