# Overview

This is a Gantt Chart Builder application with comprehensive Feature Board capabilities, styled after Stripe's design system. It's a full-stack web application that allows users to create, manage, and visualize project timelines through an interactive Gantt chart interface. The application features complete project management capabilities including task creation and editing, timeline visualization, Feature Board with full CRUD operations (Create, Read, Update, Delete), drag-and-drop functionality, and persistent data storage.

## Recent Changes
**December 20, 2025** - Completed full card editing functionality:
- Click-to-edit interface for feature cards
- Modal-based editing with pre-filled forms
- Complete field editing (title, type, description, tags, column assignment)  
- Seamless integration with existing drag-and-drop and deletion systems
- Tag color persistence across edit sessions
- Column reassignment with automatic card repositioning
- Comprehensive end-to-end testing and architectural validation

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built as a Single Page Application (SPA) using:
- **React 18** with TypeScript for component-based UI development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with Azure-inspired color scheme and design tokens

## Backend Architecture
The backend follows a minimal Express.js structure:
- **Express.js** server with TypeScript support
- **In-memory storage** pattern with interface-based design for easy database migration
- **Modular route registration** system for API endpoints
- **Development-focused** setup with hot reloading via tsx

## Data Storage Solutions
- **Local Storage** for client-side data persistence (projects, tasks, user preferences)
- **PostgreSQL** database schema defined via Drizzle ORM (prepared for future backend integration)
- **Neon Database** serverless PostgreSQL integration configured but not currently utilized
- **Interface-based storage pattern** allowing easy switching between memory and database storage

## State Management
- **React Query (TanStack Query)** for server state management and caching
- **Local React state** with custom hooks for UI state management
- **LocalStorage hook** for persistent application state across sessions

## Component Design System
- **Stripe-inspired design language** with specific color tokens and typography (Inter font)
- **Clean, minimalist aesthetic** with subtle shadows and rounded corners
- **Responsive layout** with toolbar navigation and main content area
- **Modular component architecture** separating concerns (GanttChart, TaskTable, Timeline, TaskModal, DateRangePicker)
- **Accessible UI components** using Radix UI primitives with proper ARIA support
- **Consistent spacing and interaction patterns** following Stripe's design principles

## Development Workflow
- **TypeScript** configuration with path aliases for clean imports
- **ESBuild** for production builds with Node.js platform targeting
- **Hot module replacement** in development with error overlay
- **Database migrations** prepared via Drizzle Kit for schema management

# External Dependencies

## UI Framework Dependencies
- **@radix-ui/** - Complete suite of unstyled, accessible UI primitives for building the design system
- **@tanstack/react-query** - Server state management and data fetching library
- **class-variance-authority** and **clsx** - Utility libraries for conditional CSS class management
- **tailwindcss** - Utility-first CSS framework for styling

## Development Tools
- **drizzle-orm** and **drizzle-kit** - Type-safe SQL schema definition and migration management
- **@neondatabase/serverless** - Serverless PostgreSQL database driver for edge environments
- **vite** and **@vitejs/plugin-react** - Build tool and React plugin for development server
- **tsx** - TypeScript execution environment for Node.js development

## Date and Time Management
- **date-fns** - Comprehensive date utility library for timeline calculations and formatting

## Form and Validation
- **react-hook-form** and **@hookform/resolvers** - Form state management with validation
- **zod** and **drizzle-zod** - Schema validation and type inference

## Additional Integrations
- **wouter** - Lightweight routing library for single-page application navigation
- **cmdk** - Command palette component for enhanced user interactions
- **embla-carousel-react** - Carousel component for potential timeline navigation enhancements