# TaskMate - Modern Task Management Application

A comprehensive, full-stack task management application built with modern technologies, featuring real-time collaboration, project management, calendar integration, and advanced analytics.

## Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with dark mode support
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize ORM** - Database object-relational mapping
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security

### Infrastructure
- **Docker** - Containerization for easy deployment
- **Docker Compose** - Multi-container orchestration
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## Core Features

### Authentication & User Management
- Secure user registration and login
- JWT-based authentication
- Password validation and hashing
- User profile management
- Theme preferences (Light/Dark mode)

### Task Management
- Create, edit, delete, and update tasks
- Task status tracking (Pending, In Progress, Completed, Cancelled)
- Priority levels (Low, Medium, High)
- Due date management
- Task descriptions and notes
- Search and filter functionality
- Bulk operations

### Project Management
- Project creation and organization
- Project status tracking (Planning, In Progress, On Hold, Completed)
- Progress visualization with real-time updates
- Team member assignment
- Project analytics and insights
- Task-to-project linking

### Calendar & Events
- Monthly calendar view
- Event creation and management
- Event types (Meeting, Deadline, Presentation, Task)
- Time scheduling and duration tracking
- Event priority and status management
- Calendar navigation and date selection

### Analytics & Reports
- Comprehensive dashboard with key metrics
- Task completion rates and trends
- Project progress analytics
- Priority and status distribution charts
- Time-based filtering (Week, Month, Quarter, Year)
- Export capabilities

### User Interface
- Responsive design for all devices
- Dark/Light theme switching
- Modern, intuitive UI/UX
- Real-time updates and notifications
- Accessibility features
- Mobile-optimized interface

## Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Docker & Docker Compose (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Task-Manager-Application-
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Verify database is running
docker-compose ps
```

#### Option B: Local PostgreSQL
- Install PostgreSQL on your system
- Create a database named `taskmate`
- Create a user with appropriate permissions

### 3. Backend Setup
```bash
cd task-manager-server

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Start the development server
npm run dev
```

### 4. Frontend Setup
```bash
cd task-manager-client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Database**: localhost:5432

## Project Structure

```
Task-Manager-Application-/
├── task-manager-client/          # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── contexts/            # React context providers
│   │   ├── services/            # API services
│   │   └── utils/               # Utility functions
│   ├── public/                  # Static assets
│   └── dist/                    # Build output
├── task-manager-server/          # Node.js backend
│   ├── controllers/             # Route controllers
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middleware/              # Custom middleware
│   ├── config/                  # Configuration files
│   └── scripts/                 # Database scripts
├── init-scripts/                # Database initialization
└── Documentation files          # Setup guides and API docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Reports
- `GET /api/reports/analytics` - Get analytics data
- `GET /api/reports/dashboard` - Get dashboard metrics

## Testing

### Frontend Testing
```bash
cd task-manager-client
npm run test
```

### Backend Testing
```bash
cd task-manager-server
npm test
```

## Deployment

### Production Build
```bash
# Frontend
cd task-manager-client
npm run build

# Backend
cd task-manager-server
npm run build
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.yml up --build
```

## Future Enhancements

- [ ] **Real-time Notifications** - WebSocket integration for live updates
- [ ] **File Attachments** - Upload and manage files for tasks/projects
- [ ] **Email Notifications** - Automated email reminders
- [ ] **Advanced Search** - Full-text search with filters
- [ ] **Data Export** - CSV/PDF export functionality
- [ ] **Team Collaboration** - Multi-user project management
- [ ] **Time Tracking** - Built-in time tracking for tasks
- [ ] **Mobile App** - React Native mobile application
- [ ] **API Documentation** - Swagger/OpenAPI documentation
- [ ] **Performance Optimization** - Caching and query optimization
- [ ] **AI Integration** - Smart task suggestions and automation
- [ ] **Advanced Analytics** - Machine learning insights
- [ ] **Third-party Integrations** - Slack, GitHub, Jira connectors
- [ ] **Multi-tenant Architecture** - Organization-level features
- [ ] **Offline Support** - Progressive Web App capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


**TaskMate** - Making task management simple and effective for everyone!
