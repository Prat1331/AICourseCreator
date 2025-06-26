import { db } from "./db";
import { courses } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database with sample courses...");

  const sampleCourses = [
    {
      title: "Introduction to Machine Learning",
      topic: "Machine Learning",
      difficulty: "beginner" as const,
      duration: "8 hours",
      moduleCount: 4,
      lessonCount: 12,
      modules: [
        {
          id: 1,
          title: "What is Machine Learning?",
          lessons: [
            {
              id: 1,
              title: "Understanding AI and ML",
              duration: "30 minutes",
              content: "Machine Learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. In this lesson, we'll explore the fundamental concepts that make ML so powerful.\n\nKey Concepts:\n• Supervised Learning: Learning with labeled examples\n• Unsupervised Learning: Finding patterns in unlabeled data\n• Reinforcement Learning: Learning through trial and error\n\nReal-world applications include recommendation systems, image recognition, and natural language processing.",
              objectives: ["Understand what machine learning is", "Distinguish between AI and ML", "Identify common ML applications"]
            },
            {
              id: 2,
              title: "Types of Machine Learning",
              duration: "25 minutes",
              content: "There are three main types of machine learning, each suited for different types of problems.\n\n1. Supervised Learning:\n- Uses labeled training data\n- Examples: Email spam detection, medical diagnosis\n- Common algorithms: Linear regression, decision trees\n\n2. Unsupervised Learning:\n- Finds hidden patterns in unlabeled data\n- Examples: Customer segmentation, anomaly detection\n- Common algorithms: K-means clustering, PCA\n\n3. Reinforcement Learning:\n- Learns through interaction with environment\n- Examples: Game playing, robotics\n- Common algorithms: Q-learning, policy gradients",
              objectives: ["Classify problems by ML type", "Choose appropriate learning approach", "Understand algorithm categories"],
              exercises: [
                {
                  question: "A company wants to group customers based on purchasing behavior without knowing predefined categories. What type of ML should they use?",
                  answer: "Unsupervised Learning - specifically clustering algorithms like K-means, since they want to discover hidden patterns in customer data without predefined labels."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Digital Photography Masterclass",
      topic: "Photography",
      difficulty: "intermediate" as const,
      duration: "12 hours",
      moduleCount: 6,
      lessonCount: 18,
      modules: [
        {
          id: 1,
          title: "Camera Fundamentals",
          lessons: [
            {
              id: 1,
              title: "Understanding Exposure Triangle",
              duration: "40 minutes",
              content: "The exposure triangle is the foundation of photography, consisting of three key elements that control how light enters your camera.\n\nAperture (f-stop):\n• Controls depth of field\n• Lower f-numbers = wider aperture = shallower depth of field\n• Higher f-numbers = narrower aperture = deeper depth of field\n\nShutter Speed:\n• Controls motion blur and camera shake\n• Fast speeds freeze motion\n• Slow speeds create motion blur\n\nISO:\n• Controls sensor sensitivity to light\n• Lower ISO = less noise, better image quality\n• Higher ISO = more noise, but allows shooting in darker conditions\n\nMastering these three settings allows you to take creative control of your photography.",
              objectives: ["Master the exposure triangle", "Control depth of field with aperture", "Freeze or blur motion with shutter speed", "Balance ISO for optimal image quality"]
            }
          ]
        }
      ]
    },
    {
      title: "Personal Finance Management",
      topic: "Finance",
      difficulty: "beginner" as const,
      duration: "6 hours",
      moduleCount: 5,
      lessonCount: 15,
      modules: [
        {
          id: 1,
          title: "Budgeting Basics",
          lessons: [
            {
              id: 1,
              title: "Creating Your First Budget",
              duration: "35 minutes",
              content: "A budget is your financial roadmap - it tells your money where to go instead of wondering where it went.\n\nStep 1: Calculate Your Income\n• Include all sources: salary, freelance, side hustles\n• Use net income (after taxes)\n• Be conservative with variable income\n\nStep 2: List Your Expenses\n• Fixed expenses: rent, insurance, loans\n• Variable expenses: groceries, utilities, entertainment\n• Don't forget irregular expenses: car maintenance, gifts\n\nStep 3: Apply the 50/30/20 Rule\n• 50% for needs (housing, food, utilities)\n• 30% for wants (entertainment, dining out)\n• 20% for savings and debt repayment\n\nStep 4: Track and Adjust\n• Monitor spending weekly\n• Adjust categories as needed\n• Celebrate small wins",
              objectives: ["Calculate total monthly income", "Categorize all expenses", "Apply budgeting frameworks", "Set up tracking systems"],
              exercises: [
                {
                  question: "If your monthly take-home pay is $4,000, how much should you allocate to each category using the 50/30/20 rule?",
                  answer: "Needs: $2,000 (50%), Wants: $1,200 (30%), Savings/Debt: $800 (20%)"
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  try {
    // Check if courses already exist
    const existingCourses = await db.select().from(courses);
    
    if (existingCourses.length === 0) {
      // Insert sample courses
      for (const courseData of sampleCourses) {
        await db.insert(courses).values(courseData);
      }
      console.log("✅ Sample courses added to database");
    } else {
      console.log("📚 Database already contains courses");
    }
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}

export { seedDatabase };