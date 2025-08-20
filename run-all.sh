#!/bin/bash

echo "🚀 Starting TaskMate Application..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Port $1 is already in use"
        return 0
    else
        echo "❌ Port $1 is not in use"
        return 1
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts - $service_name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to start after $max_attempts attempts"
    return 1
}

# Start PostgreSQL database
echo "🐘 Starting PostgreSQL database..."
if ! check_port 5432; then
    docker-compose up -d postgres
    sleep 5
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker-compose exec -T postgres pg_isready -U taskmate_user -d taskmate >/dev/null 2>&1; do
    echo "   Database not ready yet..."
    sleep 2
done
echo "✅ Database is ready!"

# Start backend server
echo "🔧 Starting backend server..."
if ! check_port 5001; then
    cd task-manager-server
    npm run dev &
    BACKEND_PID=$!
    cd ..
    sleep 3
fi

# Wait for backend to be ready
if wait_for_service "http://localhost:5001/api/auth/signin" "Backend Server"; then
    echo "✅ Backend server is running on http://localhost:5001"
else
    echo "❌ Backend server failed to start"
    exit 1
fi

# Start frontend client
echo "🎨 Starting frontend client..."
if ! check_port 5173; then
    cd task-manager-client
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    sleep 3
fi

# Wait for frontend to be ready
if wait_for_service "http://localhost:5173" "Frontend Client"; then
    echo "✅ Frontend client is running on http://localhost:5173"
else
    echo "❌ Frontend client failed to start"
    exit 1
fi

echo ""
echo "🎉 TaskMate Application is now running!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5001"
echo "🐘 Database: localhost:5432"
echo ""
echo "👤 Demo Account:"
echo "   Email: demo@example.com"
echo "   Password: Demo123!@#"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait 