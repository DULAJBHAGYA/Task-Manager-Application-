# TaskMate Client

A modern, responsive task management application built with React and Vite, styled with Tailwind CSS.

## 🚀 Features

### **Landing Page**
- Beautiful, responsive landing page with hero section
- Feature highlights and call-to-action
- Navigation to authentication and other sections
- Fully responsive design for all devices

### **Authentication System**
- Login and registration forms
- Split layout design (text on left, form on right)
- Form validation and error handling
- Responsive design for mobile and desktop

### **Task Dashboard**
- **Task Management**: Create, edit, delete, and update tasks
- **Status Tracking**: Pending, In Progress, Completed
- **Priority Levels**: Low, Medium, High
- **Search & Filter**: Search by title/description, filter by status
- **Sorting**: Sort by date, status, or priority
- **Local Storage**: Persistent data storage
- **Responsive Design**: Works on all screen sizes

### **Project Management**
- **Project Creation**: Add new projects with detailed information
- **Project Tracking**: Monitor progress, deadlines, and team members
- **Status Management**: Planning, In Progress, On Hold, Completed
- **Progress Visualization**: Visual progress bars and statistics
- **Team Collaboration**: Assign team members to projects
- **Responsive Grid**: Adapts to different screen sizes

### **Calendar System**
- **Month View**: Full calendar grid with navigation
- **Event Management**: Create, edit, and delete events
- **Event Types**: Meeting, Deadline, Presentation, Task, General Event
- **Time Management**: Start time, duration, and scheduling
- **Attendee Management**: Add/remove team members for events
- **Interactive Interface**: Click dates to view events
- **Responsive Design**: Mobile-friendly calendar interface

### **Analytics & Reports**
- **Key Metrics**: Total tasks, completion rates, active projects
- **Time-based Filtering**: Week, month, quarter, year views
- **Data Visualization**: Priority and status distribution charts
- **Project Analytics**: Project status overview and progress tracking
- **Recent Activity**: Timeline of recent tasks and projects
- **Responsive Charts**: Adapts to different screen sizes

### **Settings & Preferences**
- **Profile Management**: Update personal information
- **Application Preferences**: Theme, language, timezone settings
- **Security Settings**: Two-factor authentication, session timeout
- **Notification Preferences**: Email, push, and SMS notifications
- **Tabbed Interface**: Organized settings categories
- **Responsive Forms**: Mobile-friendly input fields

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: Local Storage
- **Icons**: Heroicons (SVG)
- **Responsive Design**: Mobile-first approach

## 📱 Responsive Design

All pages are fully responsive and optimized for:
- **Mobile Devices** (320px+)
- **Tablets** (768px+)
- **Desktop** (1024px+)
- **Large Screens** (1280px+)

### **Responsive Features**
- **Mobile Sidebar**: Collapsible sidebar with overlay
- **Flexible Grids**: Adapts from 1 column (mobile) to 3+ columns (desktop)
- **Touch-Friendly**: Optimized button sizes and spacing
- **Mobile Navigation**: Hamburger menu and mobile-optimized layouts
- **Responsive Typography**: Scales appropriately across devices
- **Flexible Forms**: Stack vertically on small screens

## 🏗️ Project Structure

```
task-manager-client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.jsx      # Main sidebar component
│   │   ├── TopBar.jsx       # Top navigation bar
│   │   ├── DevNavigation.jsx # Development navigation
│   │   └── ...              # Other components
│   ├── pages/               # Page components
│   │   ├── LandingPage.jsx  # Landing page
│   │   ├── AuthPage.jsx     # Authentication page
│   │   ├── DashboardPage.jsx # Task dashboard
│   │   ├── ProjectsPage.jsx # Project management
│   │   ├── CalendarPage.jsx # Calendar and events
│   │   ├── ReportsPage.jsx  # Analytics and reports
│   │   └── SettingsPage.jsx # User settings
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and Tailwind
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── README.md               # Project documentation
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Page Navigation

### **Public Pages**
- **Landing Page** (`/`) - Marketing and introduction
- **Authentication** (`/auth`) - Login and registration

### **Protected Pages** (Dashboard Area)
- **Dashboard** (`/dashboard`) - Task management
- **Projects** (`/projects`) - Project management
- **Calendar** (`/calendar`) - Event scheduling
- **Reports** (`/reports`) - Analytics and insights
- **Settings** (`/settings`) - User preferences

### **Development Navigation**
- Floating navigation panel for quick access during development
- Automatically hidden in production builds

## 🎨 Design System

### **Color Palette**
- **Primary**: Indigo (#4F46E5)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale (#F9FAFB to #111827)

### **Typography**
- **Headings**: Inter font family, various weights
- **Body Text**: System font stack for readability
- **Responsive Sizing**: Scales appropriately across devices

### **Components**
- **Cards**: Consistent shadow and border radius
- **Buttons**: Primary, secondary, and danger variants
- **Forms**: Consistent input styling and focus states
- **Navigation**: Responsive sidebar and top bar

## 🔧 Configuration

### **Tailwind CSS**
- Custom color palette
- Responsive breakpoints
- Component-specific utilities

### **PostCSS**
- Tailwind CSS processing
- Autoprefixer for cross-browser compatibility

### **Local Storage**
- Task persistence
- Project data storage
- User settings and preferences
- Calendar events

## 📊 Data Management

### **Tasks**
- Title, description, status, priority
- Creation date and timestamps
- Status transitions and updates

### **Projects**
- Name, description, status, priority
- Start/end dates and progress tracking
- Team member assignments
- Task counts and completion rates

### **Events**
- Title, description, date, time
- Duration and event type
- Attendee management
- Priority and status

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

### **Deploy to Static Hosting**
- Netlify, Vercel, or any static hosting service
- Upload the `dist` folder contents
- Configure routing for SPA (Single Page Application)

## 🔒 Security Features

- **Form Validation**: Client-side input validation
- **Data Sanitization**: Clean data handling
- **Local Storage**: Secure client-side data persistence
- **Responsive Security**: Mobile-optimized security interfaces

## 📱 Mobile Optimization

### **Touch Interactions**
- Optimized button sizes (44px minimum)
- Touch-friendly form inputs
- Swipe gestures for mobile navigation

### **Performance**
- Optimized images and assets
- Efficient CSS with Tailwind
- Fast loading times on mobile networks

### **Accessibility**
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color schemes

## 🧪 Testing

### **Manual Testing**
- Cross-browser compatibility
- Responsive design validation
- User interaction testing
- Performance testing

### **Browser Support**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

## 🎯 Roadmap

### **Future Features**
- **Dark Mode**: Theme switching capability
- **Real-time Collaboration**: Live updates and notifications
- **Advanced Analytics**: More detailed reporting and insights
- **Mobile App**: Native mobile application
- **API Integration**: Backend service integration
- **User Authentication**: Real authentication system
- **Data Export**: CSV/PDF export functionality

---

**TaskMate** - Making task management simple and effective for everyone! 🚀
