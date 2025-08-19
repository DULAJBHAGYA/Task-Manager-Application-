# TaskMate Docker Database Setup

This guide explains how to set up and manage the PostgreSQL database for TaskMate using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

1. **Start the database:**
   ```bash
   ./docker-setup.sh start
   ```

2. **Start database with pgAdmin (optional):**
   ```bash
   ./docker-setup.sh start-all
   ```

3. **Update your backend environment variables:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskmate
   DB_USER=taskmate_user
   DB_PASSWORD=taskmate_password
   DATABASE_URL=postgresql://taskmate_user:taskmate_password@localhost:5432/taskmate
   ```

## Docker Services

### PostgreSQL Database
- **Image**: `postgres:15-alpine`
- **Port**: `5432`
- **Database**: `taskmate`
- **Username**: `taskmate_user`
- **Password**: `taskmate_password`

### pgAdmin (Optional)
- **Image**: `dpage/pgadmin4:latest`
- **Port**: `5050`
- **URL**: http://localhost:5050
- **Email**: `admin@taskmate.com`
- **Password**: `admin123`

## Management Commands

### Using the Setup Script

```bash
# Start PostgreSQL database only
./docker-setup.sh start

# Start PostgreSQL and pgAdmin
./docker-setup.sh start-all

# Stop all services
./docker-setup.sh stop

# Restart database
./docker-setup.sh restart

# View logs
./docker-setup.sh logs

# Reset database (delete all data)
./docker-setup.sh reset

# Connect to database
./docker-setup.sh connect

# Show service status
./docker-setup.sh status

# Show help
./docker-setup.sh help
```

### Using Docker Compose Directly

```bash
# Start all services
docker-compose up -d

# Start only PostgreSQL
docker-compose up -d postgres

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Reset database (delete volumes)
docker-compose down -v
docker-compose up -d postgres
```

## Database Connection

### From Your Application
```javascript
// Connection string
postgresql://taskmate_user:taskmate_password@localhost:5432/taskmate
```

### From Command Line
```bash
# Using docker-compose
docker-compose exec postgres psql -U taskmate_user -d taskmate

# Using psql (if installed locally)
psql -h localhost -p 5432 -U taskmate_user -d taskmate
```

### From pgAdmin
1. Open http://localhost:5050
2. Login with `admin@taskmate.com` / `admin123`
3. Add new server:
   - Host: `postgres` (or `localhost` if connecting from outside Docker)
   - Port: `5432`
   - Database: `taskmate`
   - Username: `taskmate_user`
   - Password: `taskmate_password`

## Data Persistence

- **PostgreSQL Data**: Stored in Docker volume `postgres_data`
- **pgAdmin Data**: Stored in Docker volume `pgadmin_data`
- **Initialization Scripts**: Located in `./init-scripts/`

## Troubleshooting

### Database Not Starting
```bash
# Check logs
./docker-setup.sh logs

# Check if port 5432 is available
lsof -i :5432

# Reset database
./docker-setup.sh reset
```

### Connection Issues
```bash
# Check if database is ready
docker-compose exec postgres pg_isready -U taskmate_user -d taskmate

# Check service status
./docker-setup.sh status
```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v

# Remove images (optional)
docker-compose down --rmi all

# Start fresh
./docker-setup.sh start
```

## Environment Variables

The Docker Compose file uses these environment variables:

```yaml
POSTGRES_DB: taskmate
POSTGRES_USER: taskmate_user
POSTGRES_PASSWORD: taskmate_password
```

## Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production
- Restrict network access as needed

## Production Considerations

- Use external volumes for data persistence
- Set up proper backup strategies
- Configure SSL/TLS connections
- Use strong passwords
- Set up monitoring and logging
- Consider using managed database services

## File Structure

```
Task-Manager-Application-/
├── docker-compose.yml          # Docker services configuration
├── docker-setup.sh            # Management script
├── init-scripts/              # Database initialization
│   └── 01-init.sql           # Initial setup script
├── task-manager-server/       # Backend application
└── task-manager-client/       # Frontend application
``` 