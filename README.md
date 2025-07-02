# 📝 My Todo App - Full Stack MERN Application

A modern, responsive todo application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring comprehensive task management, user authentication, and a beautiful, professional UI.

## 🌟 Live Demo

- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend API**: [https://your-api.railway.app](https://your-api.railway.app)

## ✨ Key Features

### 🔐 Authentication & Security
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

### 📋 Task Management
- **CRUD Operations** - Create, Read, Update, Delete todos
- **Priority Levels** - Low, Medium, High priority tasks
- **Due Dates** - Schedule tasks with date and time
- **Status Tracking** - Active, Completed, Overdue states
- **Tag System** - Organize tasks with custom tags

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Professional Color Palette** - Unified design system
- **Interactive Dashboard** - Real-time statistics and progress
- **Smooth Animations** - Enhanced user experience
- **Dark Mode Ready** - Prepared for theme switching

### 🔍 Advanced Features
- **Smart Filtering** - Filter by status, priority, date
- **Search Functionality** - Find tasks quickly
- **Statistics Dashboard** - Track productivity metrics
- **Real-time Updates** - Instant UI updates
- **Error Handling** - Comprehensive error management


### Frontend Technologies
- **React 18** - Latest React with hooks and context
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client
- **React Router** - Client-side routing

### Backend Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for auth
- **bcryptjs** - Password hashing

## 🚀 Quick Start

### Prerequisites
```bash
Node.js (v14+)
MongoDB (local or Atlas)
Git
```

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/yourusername/my-todo-app.git
cd my-todo-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup
Create `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

### 3. Run the Application
```bash
# Terminal 1: Start Backend (from backend directory)
npm start

# Terminal 2: Start Frontend (from frontend directory)
npm run dev
```

### 4. Access the App
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000


## 🎨 Design System

Our application uses a carefully crafted, professional color palette:

- **🔵 Primary (Blue)**: Main actions, navigation, focus states
- **⚫ Secondary (Gray)**: Text, backgrounds, borders
- **🟢 Success (Green)**: Completed tasks, success messages
- **🟡 Warning (Amber)**: Medium priority, warnings
- **🔴 Error (Red)**: High priority, errors, danger actions
- **🔵 Info (Cyan)**: Information, active states


## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| GET | `/auth/me` | Get current user |

### Todo Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos (with filters) |
| POST | `/todos` | Create new todo |
| PUT | `/todos/:id` | Update todo |
| DELETE | `/todos/:id` | Delete todo |
| GET | `/todos/stats` | Get todo statistics |




## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run E2E tests
npm run test:e2e
```
