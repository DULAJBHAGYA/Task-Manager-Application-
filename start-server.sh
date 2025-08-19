#!/bin/bash

# TaskMate Server Startup Script

echo "Starting TaskMate Server with Docker PostgreSQL..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start PostgreSQL database
echo "Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Check if database is ready
if docker-compose exec postgres pg_isready -U taskmate_user -d taskmate; then
    echo "Database is ready!"
else
    echo "Database is not ready yet. Please wait a moment and try again."
    exit 1
fi

# Start the backend server
echo "Starting backend server..."
cd task-manager-server
npm run dev 