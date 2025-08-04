# Whispers Garden - 3D Interactive Plant App

## Overview

This is a React-based web application that combines 3D plant visualization with a social storytelling feature called "Whispers". Users can interact with plants in a 3D environment and view anonymous stories categorized by emotions. The app features a mobile-first design with 3D graphics powered by React Three Fiber.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Graphics**: React Three Fiber (@react-three/fiber) with Three.js
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with CSS-in-JS support
- **State Management**: Zustand for client-side state
- **Data Fetching**: TanStack Query (React Query) for server state
- **Routing**: React Router for navigation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with JSON responses
- **Development Server**: Custom Vite integration for SSR-like development

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Configured for PostgreSQL (via @neondatabase/serverless)
- **Migrations**: Drizzle Kit for schema management
- **Current Implementation**: In-memory storage (MemStorage class) for development

## Key Components

### 3D Scene Components
- **PlantScene**: Main 3D plant visualization with interactive elements
- **ForestScene**: Multiple plants creating a forest environment
- **Canvas Integration**: React Three Fiber canvas with orbital controls and lighting

### UI Components
- **WhisperStories**: Horizontal scrollable story categories with visual indicators
- **WhisperViewer**: Full-screen story viewer with auto-progression
- **NavigationBar**: Bottom navigation with Home, Tap, and Forest sections

### State Management
- **useWhispers**: Manages whisper/story data and viewing state
- **useGame**: Controls game phases (ready, playing, ended)
- **useAudio**: Handles audio playback and mute controls

## Data Flow

### Whisper System
1. Stories are categorized by emotion (frustration, regrets, thoughts, memories, open)
2. Each category displays visual indicators for unviewed content
3. Stories auto-progress through categories when viewed
4. Viewing state is tracked and persisted

### 3D Interaction
1. Plant components respond to user interaction (hover, click)
2. Animations driven by React Three Fiber's useFrame hook
3. Smooth transitions and particle effects for engagement

### API Communication
- REST endpoints for whispers (`/api/whispers`)
- CRUD operations: GET all whispers, POST new whisper, PATCH mark as viewed
- Error handling with appropriate HTTP status codes

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, React Router
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **UI Framework**: Radix UI components, Tailwind CSS
- **State Management**: Zustand with selectors
- **HTTP Client**: TanStack Query for caching and synchronization

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **Database**: Drizzle ORM, Drizzle Kit
- **TypeScript**: Full type safety across client and server
- **Linting**: ESLint configuration for code quality

### Database Integration
- **Neon Database**: Serverless PostgreSQL provider
- **Connection Pooling**: Built into @neondatabase/serverless
- **Schema Validation**: Zod schemas for runtime type checking

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations run via `db:push` command

### Development Environment
- **Dev Server**: Single command (`npm run dev`) starts Express with Vite integration
- **Hot Reload**: Vite HMR for frontend, tsx for backend auto-restart
- **Database**: Environment variable `DATABASE_URL` required

### Production Setup
- **Server**: Express serves built frontend assets and API routes
- **Database**: PostgreSQL connection via environment variables
- **Assets**: Static files served from `dist/public`
- **Process**: Node.js with ES module support

### Environment Configuration
- **Database URL**: Required for both development and production
- **Build Output**: Optimized for deployment to Node.js hosting platforms
- **Asset Handling**: Vite optimizes 3D models, audio files, and shaders