#!/bin/bash

echo "Starting TaskMate Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found in current directory"
    exit 1
fi

print_header "Setting up TaskMate Application..."

# Start PostgreSQL database
print_status "Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Check if database is running
if docker-compose ps postgres | grep -q "Up"; then
    print_status "Database is running successfully"
else
    print_error "Failed to start database"
    exit 1
fi

# Start backend server
print_status "Starting backend server..."
cd task-manager-server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:5001/health > /dev/null; then
    print_status "Backend server is running successfully"
else
    print_warning "Backend server might still be starting up..."
fi

# Start frontend client
print_status "Starting frontend client..."
cd ../task-manager-client

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

print_header "TaskMate Application is starting up!"

echo ""
echo "Services Status:"
echo "Database:  http://localhost:5432"
echo "Backend:   http://localhost:5001"
echo "Frontend:  http://localhost:5173"
echo ""
echo "To stop all services, press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    print_status "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker-compose down
    print_status "All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait 