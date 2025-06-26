import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCourse } from "./services/gemini";
import { courseGenerationSchema, courseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate course using AI
  app.post("/api/courses/generate", async (req, res) => {
    try {
      const { topic, difficulty } = courseGenerationSchema.parse(req.body);
      
      // Generate course using Gemini AI
      const courseData = await generateCourse(topic, difficulty);
      
      // Validate the generated course data
      const validatedCourse = courseSchema.parse(courseData);
      
      // Save the course to storage
      const savedCourse = await storage.createCourse({
        title: validatedCourse.title,
        topic: validatedCourse.topic,
        difficulty: validatedCourse.difficulty,
        duration: validatedCourse.duration,
        moduleCount: validatedCourse.moduleCount,
        lessonCount: validatedCourse.lessonCount,
        modules: validatedCourse.modules,
      });
      
      res.json(savedCourse);
    } catch (error) {
      console.error("Course generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate course", 
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  // Get course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Search courses
  app.get("/api/courses/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const courses = await storage.searchCourses(query);
      res.json(courses);
    } catch (error) {
      console.error("Error searching courses:", error);
      res.status(500).json({ error: "Failed to search courses" });
    }
  });

  // Get courses by difficulty
  app.get("/api/courses/difficulty/:difficulty", async (req, res) => {
    try {
      const { difficulty } = req.params;
      if (!["beginner", "intermediate", "advanced"].includes(difficulty)) {
        return res.status(400).json({ error: "Invalid difficulty level" });
      }

      const courses = await storage.getCoursesByDifficulty(difficulty);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses by difficulty:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
