# TaskMate Server Setup with Docker PostgreSQL

## Quick Start

### 1. Start Everything at Once
```bash
./start-server.sh
```

This script will:
- Start Docker PostgreSQL database
- Wait for database to be ready
- Start the backend server

### 2. Manual Setup (Alternative)

**Step 1: Start Database**
```bash
docker-compose up -d postgres
```

**Step 2: Start Backend Server**
```bash
cd task-manager-server
npm run dev
```

## Database Configuration

The server is already configured to use Docker PostgreSQL:

- **Host**: localhost
- **Port**: 5432
- **Database**: taskmate
- **Username**: taskmate_user
- **Password**: taskmate_password

## Verification

### Check Database
```bash
./verify-db.sh
```

### Check Server
```bash
curl http://localhost:5001/health
```

## Troubleshooting

### If Docker is not running:
1. Open Docker Desktop
2. Wait for it to start
3. Run `./start-server.sh` again

### If database connection fails:
```bash
./docker-setup.sh restart
```

### If server won't start:
```bash
cd task-manager-server
npm install
npm run dev
```

## Services

- **Backend Server**: http://localhost:5001
- **PostgreSQL Database**: localhost:5432
- **pgAdmin** (optional): http://localhost:5050

## Environment Variables

The server uses these default values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmate
DB_USER=taskmate_user
DB_PASSWORD=taskmate_password
``` 