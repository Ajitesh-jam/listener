import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const whispers = pgTable("whispers", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  viewed: boolean("viewed").default(false).notNull(),
  authorId: integer("author_id").references(() => users.id),
  isShared: boolean("is_shared").default(false).notNull(),
  sharedAt: timestamp("shared_at"),
  originalAuthorId: integer("original_author_id").references(() => users.id),
});

export const whisperShares = pgTable("whisper_shares", {
  id: serial("id").primaryKey(),
  whisperId: integer("whisper_id").references(() => whispers.id).notNull(),
  sharedByUserId: integer("shared_by_user_id").references(() => users.id).notNull(),
  sharedToUserId: integer("shared_to_user_id").references(() => users.id),
  shareCode: text("share_code").unique(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWhisperSchema = createInsertSchema(whispers).pick({
  content: true,
  category: true,
});

export const insertWhisperShareSchema = createInsertSchema(whisperShares).pick({
  whisperId: true,
  sharedByUserId: true,
  sharedToUserId: true,
  shareCode: true,
  expiresAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWhisper = z.infer<typeof insertWhisperSchema>;
export type Whisper = typeof whispers.$inferSelect;
export type InsertWhisperShare = z.infer<typeof insertWhisperShareSchema>;
export type WhisperShare = typeof whisperShares.$inferSelect;
