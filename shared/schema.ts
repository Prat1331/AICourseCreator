import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: text("duration").notNull(),
  moduleCount: integer("module_count").notNull(),
  lessonCount: integer("lesson_count").notNull(),
  modules: json("modules").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const courseSchema = z.object({
  title: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.string(),
  moduleCount: z.number(),
  lessonCount: z.number(),
  modules: z.array(z.object({
    id: z.number(),
    title: z.string(),
    lessons: z.array(z.object({
      id: z.number(),
      title: z.string(),
      duration: z.string(),
      content: z.string(),
      objectives: z.array(z.string()),
      exercises: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })).optional(),
    })),
  })),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const courseGenerationSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type CourseGeneration = z.infer<typeof courseGenerationSchema>;
export type CourseData = z.infer<typeof courseSchema>;
