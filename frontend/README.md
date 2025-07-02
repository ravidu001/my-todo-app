# 📝 My Todo App

A modern, full-stack todo application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a beautiful, responsive UI and comprehensive task management capabilities.

## ✨ Features

- **User Authentication** - Secure login and registration system
- **Task Management** - Create, read, update, and delete todos
- **Priority Levels** - Set tasks as low, medium, or high priority
- **Due Dates** - Schedule tasks with date and time
- **Task Filtering** - Filter by status, priority, and search functionality
- **Statistics Dashboard** - View task completion stats and progress
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Professional UI** - Modern, clean interface with unified color palette
- **Real-time Updates** - Instant task updates without page refresh

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Axios** - HTTP client for API requests
- **React Context API** - State management for authentication and todos
- **React Hooks** - Modern React patterns for state and lifecycle management

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for Node.js
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - Object Document Mapper (ODM) for MongoDB
- **JWT (JSON Web Tokens)** - Secure authentication and authorization
- **bcryptjs** - Password hashing for security
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **Git** - Version control system

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd my-todo-app
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/todoapp
# JWT_SECRET=your-secret-key-here
# PORT=5000

# Start the backend server
npm start
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
my-todo-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── todoController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── todos.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   └── TodoFilters.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── TodoContext.jsx
│   │   ├── utils/
│   │   │   └── axiosConfig.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── COLOR_PALETTE_GUIDE.md
└── README.md
```

## 🎨 Design System

The application features a unified, professional color palette:
- **Primary**: Professional blue tones for main actions
- **Secondary**: Warm gray tones for text and backgrounds
- **Success**: Green tones for completed tasks
- **Warning**: Amber tones for medium priority
- **Error**: Red tones for high priority and errors
- **Info**: Cyan tones for information and active states

See `COLOR_PALETTE_GUIDE.md` for detailed color specifications.

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get all todos (with filtering)
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/todos/stats` - Get todo statistics

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update API base URL in `axiosConfig.js`

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the backend code
3. Update frontend API configuration

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Whitelist your deployment IP addresses

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the excellent database
- All open-source contributors who made this project possible

---

⭐ If you found this project helpful, please give it a star!
