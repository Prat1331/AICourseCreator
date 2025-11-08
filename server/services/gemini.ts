import { GoogleGenAI } from "@google/genai";
import type { CourseData } from "@shared/schema";

/**
 * Initialize Gemini AI client
 */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

/**
 * Sleep helper
 */
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Detects if an error is a rate limit or quota-related issue
 */
function isRateLimitError(err: any): boolean {
  if (!err) return false;

  const message = String(err.message || err.error?.message || "");
  const code = err.status || err.error?.code || "";
  const status = err.error?.status || "";
  const errStr = String(err);

  if (
    code === 429 ||
    err.error?.code === 429 ||
    status === "RESOURCE_EXHAUSTED" ||
    message.match(/quota|RATE_LIMIT|RESOURCE_EXHAUSTED|Quota exceeded/i) ||
    errStr.includes("429")
  ) {
    console.log("⚠️ Rate limit detected:", {
      status: err.status,
      code: err.error?.code,
      statusText: err.error?.status,
      message,
    });
    return true;
  }

  return false;
}

/**
 * Request queue system to space out API requests
 */
class RequestQueue {
  private queue: Array<{
    fn: () => Promise<any>;
    resolve: (val: any) => void;
    reject: (err: any) => void;
  }> = [];

  private processing = false;
  private lastRequestTime = 0;
  private readonly minDelay = 2000; // 2s delay between API calls

  enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  private async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length) {
      const { fn, resolve, reject } = this.queue.shift()!;
      const sinceLast = Date.now() - this.lastRequestTime;

      if (sinceLast < this.minDelay) {
        await sleep(this.minDelay - sinceLast);
      }

      try {
        this.lastRequestTime = Date.now();
        resolve(await fn());
      } catch (err) {
        reject(err);
      }
    }

    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

/**
 * Exponential backoff for rate limit retries
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 5,
  baseDelay = 5000
): Promise<T> {
  let error: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      error = err;

      if (!isRateLimitError(err)) {
        console.error("❌ Non-rate-limit error:", err);
        throw err;
      }

      if (attempt === maxRetries) {
        console.error(`⚠️ Max retry attempts (${maxRetries}) reached.`);
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 2000;
      console.log(
        `⏳ Rate limit hit. Retrying in ${Math.round(delay / 1000)}s (attempt ${
          attempt + 1
        }/${maxRetries})`
      );
      await sleep(delay);
    }
  }

  throw error;
}

/**
 * Generates a full course structure
 */
export async function generateCourse(
  topic: string,
  difficulty: string
): Promise<CourseData> {
  const systemPrompt = `
You are an expert educational content creator.
Create a comprehensive course structure for the given topic and difficulty level.

Return JSON ONLY in this structure:
{
  "title": "Course Title",
  "topic": "Original topic",
  "difficulty": "beginner|intermediate|advanced",
  "duration": "X hours",
  "moduleCount": number,
  "lessonCount": number,
  "modules": [
    {
      "id": number,
      "title": "Module Title",
      "lessons": [
        {
          "id": number,
          "title": "Lesson Title",
          "duration": "X minutes",
          "content": "Detailed lesson content",
          "objectives": ["Learning objective 1", "Learning objective 2"],
          "exercises": [
            { "question": "Question", "answer": "Solution" }
          ]
        }
      ]
    }
  ]
}`;

  const userPrompt = `Create a comprehensive ${difficulty}-level course on "${topic}".
Ensure it's practical, engaging, and includes examples & exercises.`;

  try {
    const response = await requestQueue.enqueue(() =>
      retryWithBackoff(() =>
        ai.models.generateContent({
          model: "gemini-2.5-flash",
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
          },
          contents: userPrompt,
        })
      )
    );

    const raw = response.text;
    if (!raw) throw new Error("Empty response from Gemini API");

    const course: CourseData = JSON.parse(raw);

    if (!course.title || !Array.isArray(course.modules))
      throw new Error("Invalid course structure received from AI");

    return course;
  } catch (err: any) {
    console.error("🚨 Course generation failed:", err);

    if (isRateLimitError(err)) {
      const quota = err?.error?.details?.[0]?.metadata?.quota_limit_value;
      if (quota === "0" || quota === 0) {
        throw new Error(
          "AI service quota exhausted. Please contact support or try again later."
        );
      }
      throw new Error(
        "AI service is temporarily busy. Please try again in a few minutes."
      );
    }

    throw new Error(
      `Course generation failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}

/**
 * Generates content for a specific lesson
 */
export async function generateCourseContent(
  lessonTitle: string,
  moduleTitle: string,
  difficulty: string
): Promise<string> {
  const prompt = `
Generate detailed, structured educational content for a ${difficulty}-level lesson titled "${lessonTitle}" 
from the module "${moduleTitle}".

Requirements:
- Clear explanations
- Practical examples
- Engaging tone
- Self-paced learning style
Return clean, well-formatted text.`;

  try {
    const response = await requestQueue.enqueue(() =>
      retryWithBackoff(() =>
        ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        })
      )
    );

    return response.text || "⚠️ Content generation failed.";
  } catch (err: any) {
    console.error("🚨 Lesson content generation failed:", err);

    if (isRateLimitError(err)) {
      const quota = err?.error?.details?.[0]?.metadata?.quota_limit_value;
      if (quota === "0" || quota === 0) {
        throw new Error("AI service quota exhausted. Try again later.");
      }
      throw new Error("AI service is temporarily busy. Please retry soon.");
    }

    throw new Error("Lesson content generation failed.");
  }
}
