# 🧠 AI Course Builder

An AI-powered full-stack web application that generates educational courses based on a topic and difficulty level. Built with **React**, **Express**, **TypeScript**, **Tailwind CSS**, and integrated with **Google Gemini AI** for content generation.

---

## 🚀 Features

- 📚 Generate courses with structured modules and lessons using AI
- 🔍 Input topic and difficulty level to get dynamic course content
- 🎨 Responsive UI with Tailwind CSS + shadcn/ui
- 🗃️ PostgreSQL database using Drizzle ORM
- 🔌 REST API backend with Express and TypeScript
- ⚙️ Clean architecture with full-stack TypeScript
- 🌐 SPA-friendly deployment via Netlify with `_redirects`

---

## 🧱 Tech Stack

### 🔧 Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Radix UI primitives
- Wouter for client-side routing
- Vite as build tool

### 🛠 Backend
- Node.js + Express (ESM)
- TypeScript
- Drizzle ORM (PostgreSQL)
- Google Gemini AI API
- dotenv for environment variables

---

## 🗃️ Folder Structure

.
├── client/
│ ├── public/
│ │ ├── _redirects
│ │ └── index.html
│ └── src/
│ └── ... (components, pages, hooks, etc.)
├── server/
│ ├── db.ts
│ ├── index.ts
│ └── routes/
│ └── courseRoutes.ts
├── shared/
│ └── schema.ts
├── drizzle.config.ts
├── package.json
├── .env
└── README.md

yaml
Copy
Edit

---

## 🧪 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-course-builder.git
cd ai-course-builder
2. Install dependencies
bash
Copy
Edit
npm install
3. Setup environment variables
Create a .env file in the root:

env
Copy
Edit
DATABASE_URL=your_postgres_connection_string
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
4. Push DB schema
bash
Copy
Edit
npm run db:push
5. Start the app
bash
Copy
Edit
npm run dev
Frontend: http://localhost:5173

Backend API: http://localhost:5050/api

🌐 Deployment
Frontend
Built using Vite

_redirects file ensures SPA routing on Netlify

Build command:

bash
Copy
Edit
npm run build
Deploy dist/public/ folder to Netlify

Backend (Optional)
Use services like:

Render

Railway

Fly.io

🧠 AI Integration
Uses Google Gemini AI to generate:

Modules

Lessons

Objectives

Exercises

🙌 Credits
Built by Pratham Gera

Dataset validation & feedback by Sport Arena

UI powered by shadcn/ui + Tailwind CSS

