🔗 Live App: https://aicoursebuilder.netlify.app

🧠 AI Course Builder
An AI-powered full-stack web application that automatically generates rich educational courses tailored to a given topic and difficulty level. Leveraging the power of Google Gemini AI, it crafts structured modules, lessons, objectives, and exercises in seconds — helping educators, students, and lifelong learners build knowledge efficiently.

🚀 Key Features
📚 AI-Generated Courses: Structured modules, lessons, objectives, and exercises on demand.

🔍 Custom Input: Users enter a topic and difficulty level to get tailored content.

🎨 Sleek UI: Built with Tailwind CSS and shadcn/ui for a modern, responsive interface.

🗃️ Database Integration: Uses PostgreSQL with Drizzle ORM for seamless data handling.

🔌 RESTful API: Backend built in Express with full TypeScript support.

⚙️ End-to-End TypeScript: Clean, scalable architecture from client to server.

🌐 SPA-Friendly Deployment: Uses _redirects file for smooth Netlify hosting.

🧱 Tech Stack
🔧 Frontend
React 18 + TypeScript

Tailwind CSS + shadcn/ui

Radix UI primitives

Wouter for routing

Vite as build tool

🛠 Backend
Node.js + Express (ESM)

TypeScript

Drizzle ORM (PostgreSQL)

Google Gemini AI API

dotenv for environment management

📁 Folder Structure
pgsql
Copy
Edit
.
├── client/
│   ├── public/
│   │   ├── _redirects
│   │   └── index.html
│   └── src/ (components, pages, hooks, etc.)
├── server/
│   ├── db.ts
│   ├── index.ts
│   └── routes/
│       └── courseRoutes.ts
├── shared/
│   └── schema.ts
├── drizzle.config.ts
├── .env
├── package.json
└── README.md
🧪 Getting Started
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/ai-course-builder.git
cd ai-course-builder
Install dependencies

bash
Copy
Edit
npm install
Set up environment variables
Create a .env file in the root:

env
Copy
Edit
DATABASE_URL=your_postgres_connection_string
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
Push DB schema

bash
Copy
Edit
npm run db:push
Start the app

bash
Copy
Edit
npm run dev
Frontend: http://localhost:5173

Backend API: http://localhost:5050/api

🌐 Deployment
Frontend (Netlify)

Built with Vite

_redirects handles SPA routing

Deploy dist/public/ folder

Backend (Optional)
Can be hosted on:

Render

Railway

Fly.io

🧠 AI Integration
Utilizes Google Gemini AI to generate:

📘 Course Modules

🎓 Lesson Plans

🎯 Learning Objectives

🧩 Practice Exercises

🙌 Credits
Built by Pratham Gera
Dataset validation & feedback by Sport Arena
UI powered by shadcn/ui + Tailwind CSS


