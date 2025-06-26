import { GoogleGenAI } from "@google/genai";
import type { CourseData } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY! 
});

export async function generateCourse(topic: string, difficulty: string): Promise<CourseData> {
  try {
    const systemPrompt = `You are an expert educational content creator. Create a comprehensive course structure for the given topic and difficulty level.

The course should include:
- A clear, engaging title
- 4-8 modules with logical progression
- 3-6 lessons per module
- Learning objectives for each lesson
- Detailed content for each lesson
- Interactive exercises where appropriate

Respond with JSON in this exact format:
{
  "title": "Course Title",
  "topic": "Original topic",
  "difficulty": "beginner|intermediate|advanced",
  "duration": "X hours",
  "moduleCount": number,
  "lessonCount": number,
  "modules": [
    {
      "id": 1,
      "title": "Module Title",
      "lessons": [
        {
          "id": 1,
          "title": "Lesson Title",
          "duration": "X minutes",
          "content": "Detailed lesson content with explanations, examples, and practical information",
          "objectives": ["Learning objective 1", "Learning objective 2"],
          "exercises": [
            {
              "question": "Practice question",
              "answer": "Expected answer or solution"
            }
          ]
        }
      ]
    }
  ]
}`;

    const userPrompt = `Create a comprehensive ${difficulty}-level course on: ${topic}

Make sure the course is practical, engaging, and follows modern educational best practices. Include real-world examples and hands-on exercises where applicable.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    const courseData: CourseData = JSON.parse(rawJson);
    
    // Validate the structure
    if (!courseData.title || !courseData.modules || !Array.isArray(courseData.modules)) {
      throw new Error("Invalid course structure received from AI");
    }

    return courseData;
  } catch (error) {
    console.error("Failed to generate course:", error);
    
    // Handle specific API quota errors with user-friendly messages
    if (error instanceof Error && error.message.includes('quota')) {
      throw new Error('AI service is temporarily at capacity. Please try again in a few minutes, or explore our sample courses while you wait.');
    }
    
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error('AI service is temporarily busy. Please try again in a few moments.');
    }
    
    throw new Error(`Course generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateCourseContent(lessonTitle: string, moduleTitle: string, difficulty: string): Promise<string> {
  try {
    const prompt = `Create detailed educational content for a ${difficulty}-level lesson titled "${lessonTitle}" 
    which is part of the module "${moduleTitle}".
    
    The content should be:
    - Comprehensive and educational
    - Well-structured with clear explanations
    - Include practical examples
    - Suitable for self-paced learning
    - Engaging and easy to understand
    
    Format the response as clean, educational text with proper structure.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Content generation failed";
  } catch (error) {
    console.error("Failed to generate lesson content:", error);
    throw new Error("Failed to generate lesson content");
  }
}
