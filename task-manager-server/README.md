# TaskMate Backend Server

A Node.js backend server for the TaskMate task management application, built with Express.js and PostgreSQL.

## 🚀 Features

- **User Management**: Authentication, authorization, and user profiles
- **Task Management**: CRUD operations for tasks with status tracking
- **Project Management**: Project creation, team management, and progress tracking
- **Calendar System**: Event scheduling and management
- **Reporting**: Analytics and insights generation
- **RESTful API**: Clean, well-structured API endpoints
- **Security**: JWT authentication, rate limiting, and input validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator + Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Email**: Nodemailer

## 📁 Project Structure

```
task-manager-server/
├── config/                 # Configuration files
│   └── database.js        # Database connection setup
├── middleware/             # Custom middleware
│   ├── auth.js            # Authentication middleware
│   └── errorHandler.js    # Error handling middleware
├── models/                 # Database models
│   ├── User.js            # User model
│   ├── Task.js            # Task model
│   ├── Project.js         # Project model
│   └── Event.js           # Event model
├── routes/                 # API route handlers
│   ├── auth.js            # Authentication routes
│   ├── users.js           # User management routes
│   ├── tasks.js           # Task management routes
│   ├── projects.js        # Project management routes
│   ├── events.js          # Event management routes
│   └── reports.js         # Reporting routes
├── scripts/                # Utility scripts
│   └── seed.js            # Database seeding script
├── utils/                  # Utility functions
│   └── logger.js          # Logging configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file
├── package.json            # Dependencies and scripts
├── server.js               # Main server file
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb taskmate
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE taskmate;
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmate
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/taskmate

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=TaskMate <noreply@taskmate.com>
```

### Database Configuration

The server automatically connects to PostgreSQL using the environment variables. Make sure your PostgreSQL server is running and accessible.

## 📊 Database Models

### User Model
- Personal information (name, email, avatar)
- Authentication details (password, tokens)
- Preferences (theme, language, timezone)
- Security settings (2FA, session timeout)

### Task Model
- Basic information (title, description, status)
- Assignment and tracking (assignee, creator, project)
- Time management (due date, estimated hours)
- Progress tracking and categorization

### Project Model
- Project details (name, description, status)
- Team management (owner, manager, members)
- Timeline and budget tracking
- Progress monitoring and milestones

### Event Model
- Event information (title, description, type)
- Scheduling (date, time, duration)
- Attendee management
- Recurring event support

## 🚀 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:reset` - Reset database (drop, create, migrate, seed)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update user settings

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Reports
- `GET /api/reports/dashboard` - Get dashboard reports
- `GET /api/reports/tasks` - Get task reports
- `GET /api/reports/projects` - Get project reports
- `GET /api/reports/analytics` - Get analytics data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Rate Limiting**: API request rate limiting
- **Input Validation**: Request data validation
- **CORS Protection**: Cross-origin resource sharing control
- **Helmet Security**: Security headers middleware

## 📱 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Development

### Code Style

The project uses ESLint with Airbnb configuration. Run linting:

```bash
npm run lint
npm run lint:fix
```

### Database Migrations

For production deployments, use proper migrations instead of `sync()`:

```bash
npm run db:migrate
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all production environment variables are properly set:
- Database connection strings
- JWT secrets
- Email configuration
- Security settings

### Database

- Use production PostgreSQL instance
- Set up proper database backups
- Configure connection pooling
- Monitor database performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**TaskMate Backend** - Powering the future of task management! 🚀 