# AI Course Builder

## Overview

This is a full-stack AI-powered course generation application built with React, Express, and TypeScript. The application allows users to input a topic and difficulty level, then uses Google's Gemini AI to generate comprehensive educational courses with structured modules, lessons, and interactive content.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful API with /api prefix
- **Middleware**: Express built-in middleware for JSON parsing and static files
- **Error Handling**: Centralized error handling middleware

### Database & Storage
- **Primary Database**: PostgreSQL (configured via Drizzle ORM)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Connection**: Neon Database with connection pooling
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Database File**: Database connection and setup in `/server/db.ts`

## Key Components

### Course Generation System
- **AI Integration**: Google Gemini API for content generation
- **Input Validation**: Zod schemas for request/response validation
- **Content Structure**: Hierarchical course structure (Course → Modules → Lessons)
- **Generation Flow**: Topic + Difficulty → AI Processing → Structured Course Data

### Data Models
- **Users**: Basic user authentication schema
- **Courses**: Complete course structure with modules and lessons
- **Lessons**: Individual lesson content with objectives and exercises

### UI Components
- **Course Display**: Interactive course viewer with navigation
- **Hero Section**: Course generation form with AI integration
- **Course Gallery**: Browse and search existing courses
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Data Flow

1. **Course Generation**:
   - User submits topic and difficulty via form
   - Frontend validates and sends POST to `/api/courses/generate`
   - Backend calls Gemini AI service with structured prompt
   - AI response is validated against schema
   - Course data is stored and returned to frontend

2. **Course Viewing**:
   - Frontend fetches course data via GET `/api/courses/:id`
   - Course content is parsed and displayed in interactive format
   - Users can navigate through modules and lessons

3. **Course Browsing**:
   - Frontend fetches all courses via GET `/api/courses`
   - Courses are displayed in gallery format with search functionality

## External Dependencies

### AI Services
- **Google Gemini AI**: Content generation service
- **API Key**: Configured via environment variable `GEMINI_API_KEY`

### Database
- **Neon Database**: PostgreSQL hosting service
- **Connection**: Via `DATABASE_URL` environment variable
- **Migrations**: Managed through Drizzle Kit

### UI Libraries
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Deployment Strategy

### Development
- **Local Server**: Express server with Vite middleware
- **Hot Reload**: Vite HMR for frontend, nodemon-style reload for backend
- **Port Configuration**: Server runs on port 5000

### Production
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Static Files**: Frontend assets served from `/dist/public`
- **Environment**: Production mode with optimized builds
- **Deployment Target**: Replit autoscale deployment

### Configuration
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string
  - `GEMINI_API_KEY`: Google AI API key
  - `NODE_ENV`: Environment mode
- **Build Commands**: 
  - Development: `npm run dev`
  - Production: `npm run build && npm run start`

## Changelog

- June 26, 2025: Initial setup
- June 26, 2025: Integrated Google Gemini API for AI course generation
- June 26, 2025: Added sample courses (Machine Learning, Photography, Finance)
- June 26, 2025: Improved error handling for API rate limits
- June 26, 2025: Application fully functional with attractive UI
- June 26, 2025: Added PostgreSQL database integration with Drizzle ORM
- June 26, 2025: Migrated from in-memory storage to persistent database storage
- June 26, 2025: Created database seeding functionality for sample courses

## User Preferences

Preferred communication style: Simple, everyday language.