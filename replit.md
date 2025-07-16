# Uber Clone - Full Stack Express Application

## Overview

This is a full-stack Uber clone application built with modern web technologies. The application provides comprehensive ride-booking functionality with user authentication, real-time communication, and a polished user interface. It follows a traditional client-server architecture with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Architecture
- **Frontend**: React 19 with TypeScript, using Vite for build tooling
- **Backend**: Node.js with Express server and TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured for Neon serverless)
- **Real-time Communication**: WebSocket connections for live updates
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

### Key Design Decisions

**Database Choice**: PostgreSQL was chosen for its reliability and ACID compliance, essential for ride-booking transactions. Drizzle ORM provides type-safe database operations with a schema-first approach.

**Real-time Updates**: WebSocket implementation enables live ride tracking, driver location updates, and instant notifications without constant polling.

**UI Component Strategy**: Uses shadcn/ui components for consistency and accessibility, built on top of Radix UI primitives with Tailwind CSS for styling.

**Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas ensures compile-time error detection and better developer experience.

## Key Components

### 1. Authentication System
- **User Registration**: Supports both riders and drivers with different signup flows
- **Login/Logout**: JWT-based authentication with session management
- **User Types**: Riders, drivers, and business accounts with role-based access

### 2. Ride Booking System
- **Location Input**: Pickup and dropoff location selection
- **Price Calculation**: Real-time fare estimation based on distance and ride type
- **Ride Types**: Standard, premium, and shared ride options
- **Booking Flow**: Complete ride request and driver matching system

### 3. Driver Management
- **Driver Registration**: License verification and vehicle registration
- **Driver Dashboard**: Online/offline status, earnings tracking, ride history
- **Location Tracking**: Real-time driver location updates via WebSocket
- **Ride Assignment**: Automatic matching with pending ride requests

### 4. Real-time Features
- **Live Tracking**: Driver location updates and ride progress
- **WebSocket Integration**: Bidirectional communication for instant updates
- **Notifications**: Real-time alerts for ride status changes

### 5. Business Features
- **Business Accounts**: Corporate ride management and billing
- **Fleet Management**: Vehicle rental and driver onboarding
- **Expense Tracking**: Centralized billing and reporting tools

## Data Flow

### Ride Booking Process
1. User enters pickup and dropoff locations
2. System calculates estimated fare and duration
3. Ride request is created and stored in database
4. Available drivers are notified via WebSocket
5. Driver accepts ride and updates are broadcast
6. Real-time tracking begins with location updates
7. Ride completion triggers payment and rating flow

### WebSocket Communication
- Driver location updates are broadcast to relevant riders
- Ride status changes are pushed to both driver and rider
- Real-time notifications for ride requests and updates

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database operations and migrations
- **Connection Pooling**: Efficient database connection management

### UI Libraries
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Primitive component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **Zod**: Runtime type validation

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite dev server with instant updates
- **TypeScript Compilation**: Real-time type checking
- **Database Migrations**: Drizzle kit for schema management

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild creates single production bundle
- **Database**: Drizzle handles schema migrations
- **Environment Variables**: Secure configuration management

### Folder Structure
```
├── client/          # React frontend application
├── server/          # Express backend server
├── shared/          # Shared TypeScript schemas and types
├── migrations/      # Database migration files
└── dist/           # Production build output
```

The application uses a monorepo structure with clear separation between frontend and backend code, while sharing common types and schemas to ensure consistency across the full stack.