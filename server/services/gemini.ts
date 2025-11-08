import { GoogleGenAI } from "@google/genai";
import type { CourseData } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY! 
});

// Helper function to sleep/delay
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to check if error is a rate limit error
function isRateLimitError(error: any): boolean {
  if (!error) return false;
  
  // Check for status code 429
  if (error.status === 429) return true;
  
  // Check for error code 429
  if (error.error?.code === 429) return true;
  
  // Check for RESOURCE_EXHAUSTED status
  if (error.error?.status === "RESOURCE_EXHAUSTED") return true;
  
  // Check error message for rate limit indicators
  const errorMessage = error.message || error.error?.message || "";
  if (errorMessage.includes("429") || 
      errorMessage.includes("quota") || 
      errorMessage.includes("RATE_LIMIT") ||
      errorMessage.includes("RESOURCE_EXHAUSTED")) {
    return true;
  }
  
  return false;
}

// Simple request queue to prevent rate limiting
// Process requests sequentially with a minimum delay between them
class RequestQueue {
  private queue: Array<{ fn: () => Promise<any>; resolve: (value: any) => void; reject: (error: any) => void }> = [];
  private processing = false;
  private lastRequestTime = 0;
  private readonly minDelayBetweenRequests = 1000; // 1 second minimum between requests

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      
      // Ensure minimum delay between requests
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.minDelayBetweenRequests) {
        await sleep(this.minDelayBetweenRequests - timeSinceLastRequest);
      }

      try {
        this.lastRequestTime = Date.now();
        const result = await item.fn();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }

    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Only retry on rate limit errors
      if (!isRateLimitError(error)) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate exponential backoff delay
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
      
      await sleep(delay);
    }
  }
  
  throw lastError;
}

export async function generateCourse(topic: string, difficulty: string): Promise<CourseData> {
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

  try {
    const response = await requestQueue.enqueue(() => 
      retryWithBackoff(async () => {
        return await ai.models.generateContent({
          model: "gemini-2.5-flash",
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
          },
          contents: userPrompt,
        });
      }, 3, 2000) // 3 retries with 2s initial delay
    );

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
    
    // Handle rate limit errors with user-friendly messages
    if (isRateLimitError(error)) {
      throw new Error('AI service is temporarily at capacity. Please try again in a few minutes, or explore our sample courses while you wait.');
    }
    
    throw new Error(`Course generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateCourseContent(lessonTitle: string, moduleTitle: string, difficulty: string): Promise<string> {
  const prompt = `Create detailed educational content for a ${difficulty}-level lesson titled "${lessonTitle}" 
    which is part of the module "${moduleTitle}".
    
    The content should be:
    - Comprehensive and educational
    - Well-structured with clear explanations
    - Include practical examples
    - Suitable for self-paced learning
    - Engaging and easy to understand
    
    Format the response as clean, educational text with proper structure.`;

  try {
    const response = await requestQueue.enqueue(() =>
      retryWithBackoff(async () => {
        return await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
      }, 3, 2000) // 3 retries with 2s initial delay
    );

    return response.text || "Content generation failed";
  } catch (error) {
    console.error("Failed to generate lesson content:", error);
    
    // Handle rate limit errors
    if (isRateLimitError(error)) {
      throw new Error('AI service is temporarily at capacity. Please try again in a few minutes.');
    }
    
    throw new Error("Failed to generate lesson content");
  }
}
