#!/bin/bash

# TaskMate Database Verification Script

echo "Verifying TaskMate Database Setup..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running. Please start Docker Desktop first."
    echo "Steps:"
    echo "1. Open Docker Desktop application"
    echo "2. Wait for it to fully start"
    echo "3. Run this script again"
    exit 1
fi

echo "Docker is running."

# Check if containers are running
if docker-compose ps | grep -q "taskmate-postgres"; then
    echo "PostgreSQL container is running."
    
    # Test database connection
    if docker-compose exec postgres pg_isready -U taskmate_user -d taskmate; then
        echo "Database connection successful."
        
        # Check if tables exist
        echo "Checking database tables..."
        docker-compose exec postgres psql -U taskmate_user -d taskmate -c "\dt" 2>/dev/null
        
        # Test basic queries
        echo "Testing basic database operations..."
        docker-compose exec postgres psql -U taskmate_user -d taskmate -c "SELECT version();" 2>/dev/null
        
        echo "Database setup is correct!"
        
    else
        echo "ERROR: Cannot connect to database."
        echo "Try running: ./docker-setup.sh restart"
    fi
else
    echo "PostgreSQL container is not running."
    echo "To start the database, run: ./docker-setup.sh start"
fi

# Check pgAdmin if running
if docker-compose ps | grep -q "taskmate-pgadmin"; then
    echo "pgAdmin is running at http://localhost:5050"
    echo "Login: admin@taskmate.com / admin123"
else
    echo "pgAdmin is not running."
    echo "To start pgAdmin, run: ./docker-setup.sh start-all"
fi

echo ""
echo "Database Credentials:"
echo "Host: localhost"
echo "Port: 5432"
echo "Database: taskmate"
echo "Username: taskmate_user"
echo "Password: taskmate_password"
echo ""
echo "Connection String:"
echo "postgresql://taskmate_user:taskmate_password@localhost:5432/taskmate" 