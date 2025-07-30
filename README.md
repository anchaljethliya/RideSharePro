# 🚗 RideSharePro - Uber-like Ride Sharing Platform

A modern, full-stack ride-sharing application built with Express.js backend and React frontend, featuring real-time ride booking, driver management, and premium transportation services.

## 🌐 Live Demo
- **Frontend**: [Coming Soon - Deploying to Vercel]
- **Backend API**: [Coming Soon - Deploying to Railway/Render]
- **GitHub Repository**: https://github.com/anchaljethliya/RideSharePro

## ✨ Features

### 🚀 Core Functionality
- **Real-time Ride Booking**: Request rides with pickup/dropoff locations
- **Driver Assignment**: Automatic driver matching and assignment
- **Ride Status Tracking**: Real-time updates on ride progress
- **Price Calculation**: Dynamic pricing with surge multipliers
- **Driver Management**: Driver registration, location tracking, and ratings

### 🎨 Premium Features
- **Multiple Ride Types**: Standard, Premium, Luxury, and Business options
- **Surge Pricing**: Dynamic pricing based on demand
- **Carbon Offset**: Environmental impact calculation
- **Premium Features**: Enhanced ride experience with additional amenities

### 🔧 Technical Features
- **RESTful API**: Complete backend with Express.js
- **Real-time Updates**: WebSocket support for live updates
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database Ready**: PostgreSQL schema with Drizzle ORM

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** for database management
- **PostgreSQL** database (ready for deployment)

### Development Tools
- **ESLint** for code quality
- **Prettier** for code formatting
- **Cross-env** for environment variables

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/anchaljethliya/RideSharePro.git
cd RideSharePro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_database_url_here
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Rides
- `POST /api/rides` - Request a new ride
- `GET /api/rides/calculate-price` - Calculate ride price
- `POST /api/rides/:id/assign` - Assign driver to ride
- `PATCH /api/rides/:id/status` - Update ride status

### Drivers
- `POST /api/drivers/register` - Driver registration
- `GET /api/drivers/:id/location` - Get driver location

### Users
- `GET /api/users/:id` - Get user profile

## 🎯 Project Structure
```
RideSharePro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Page components
│   │   └── hooks/        # Custom React hooks
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   └── routes.ts         # API routes
├── shared/               # Shared types and schemas
└── package.json          # Project dependencies
```

## 🔄 Development Workflow

1. **Backend Development**: API endpoints in `server/routes.ts`
2. **Frontend Development**: React components in `client/src/`
3. **Database Schema**: Defined in `shared/schema.ts`
4. **Type Safety**: Shared types between frontend and backend

## 🚀 Deployment Ready

This project is configured for easy deployment on:
- **Vercel** (Frontend)
- **Railway/Render** (Backend)
- **Neon/PlanetScale** (Database)

## 📊 Performance Features

- **Optimized Build**: Vite for fast development and production builds
- **Code Splitting**: Automatic code splitting for better performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation for better developer experience

## 🤝 Contributing

This is a personal project showcasing full-stack development skills. For collaboration or improvements, feel free to fork and submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by Anchal Jethliya**

*Showcasing modern web development skills with a real-world ride-sharing application* 