import { pgTable, serial, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  originalText: text("original_text").notNull(),
  simplifiedText: text("simplified_text"),
  risks: jsonb("risks").$type<{ severity: 'high' | 'medium' | 'low', description: string }[]>(),
  keyInfo: jsonb("key_info").$type<{ type: string, description: string }[]>(),
  language: text("language").notNull().default("English"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documentQuestions = pgTable("document_questions", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  simplifiedText: true,
  risks: true,
  keyInfo: true,
});

export const insertQuestionSchema = createInsertSchema(documentQuestions).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type DocumentQuestion = typeof documentQuestions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type CreateDocumentRequest = InsertDocument;
export type AskQuestionRequest = { question: string };