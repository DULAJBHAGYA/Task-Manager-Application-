#!/bin/bash

# TaskMate Docker Database Setup Script

echo "Setting up TaskMate PostgreSQL Database with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to start the database
start_database() {
    echo "Starting PostgreSQL database..."
    docker-compose up -d postgres
    
    echo "Waiting for database to be ready..."
    sleep 10
    
    # Check if database is ready
    if docker-compose exec postgres pg_isready -U taskmate_user -d taskmate; then
        echo "PostgreSQL database is ready!"
    else
        echo "Database is not ready yet. Please wait a moment and try again."
        exit 1
    fi
}

# Function to start pgAdmin
start_pgadmin() {
    echo "Starting pgAdmin..."
    docker-compose up -d pgadmin
    echo "pgAdmin is running at http://localhost:5050"
    echo "Email: admin@taskmate.com"
    echo "Password: admin123"
}

# Function to stop all services
stop_services() {
    echo "Stopping all services..."
    docker-compose down
    echo "All services stopped."
}

# Function to view logs
view_logs() {
    echo "Showing logs..."
    docker-compose logs -f
}

# Function to reset database
reset_database() {
    echo "Resetting database (this will delete all data)..."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker-compose up -d postgres
        echo "Database reset complete."
    else
        echo "Database reset cancelled."
    fi
}

# Function to connect to database
connect_database() {
    echo "Connecting to PostgreSQL database..."
    docker-compose exec postgres psql -U taskmate_user -d taskmate
}

# Function to show status
show_status() {
    echo "Service Status:"
    docker-compose ps
}

# Main menu
case "$1" in
    "start")
        start_database
        ;;
    "start-all")
        start_database
        start_pgadmin
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        start_database
        ;;
    "logs")
        view_logs
        ;;
    "reset")
        reset_database
        ;;
    "connect")
        connect_database
        ;;
    "status")
        show_status
        ;;
    "help"|"")
        echo "TaskMate Docker Database Management"
        echo ""
        echo "Usage: ./docker-setup.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start      - Start PostgreSQL database only"
        echo "  start-all  - Start PostgreSQL and pgAdmin"
        echo "  stop       - Stop all services"
        echo "  restart    - Restart PostgreSQL database"
        echo "  logs       - View service logs"
        echo "  reset      - Reset database (delete all data)"
        echo "  connect    - Connect to PostgreSQL database"
        echo "  status     - Show service status"
        echo "  help       - Show this help message"
        echo ""
        echo "Database Credentials:"
        echo "  Host: localhost"
        echo "  Port: 5432"
        echo "  Database: taskmate"
        echo "  Username: taskmate_user"
        echo "  Password: taskmate_password"
        echo ""
        echo "pgAdmin Access:"
        echo "  URL: http://localhost:5050"
        echo "  Email: admin@taskmate.com"
        echo "  Password: admin123"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use './docker-setup.sh help' for available commands."
        exit 1
        ;;
esac 