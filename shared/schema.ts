import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Server Schema
export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ip: text("ip").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  serverType: text("server_type").notNull(),
  status: text("status").notNull().default("offline"),
  performanceRating: integer("performance_rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertServerSchema = createInsertSchema(servers).pick({
  name: true,
  ip: true,
  username: true,
  password: true,
  serverType: true,
});

// Campaign Schema
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  fromName: text("from_name").notNull(),
  fromEmail: text("from_email").notNull(),
  replyTo: text("reply_to"),
  subject: text("subject").notNull(),
  preheader: text("preheader"),
  htmlContent: text("html_content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  fromName: true,
  fromEmail: true,
  replyTo: true,
  subject: true,
  preheader: true,
  htmlContent: true,
});

// Export Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Server = typeof servers.$inferSelect;
export type InsertServer = z.infer<typeof insertServerSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
