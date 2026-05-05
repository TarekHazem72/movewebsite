import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { articlesTable } from "./articles";

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  articleId: integer("article_id").notNull().references(() => articlesTable.id, { onDelete: "cascade" }),
  authorId: integer("author_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(commentsTable).omit({ id: true, createdAt: true });
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof commentsTable.$inferSelect;
