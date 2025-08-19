-- TaskMate Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS taskmate_schema;

-- Set timezone
SET timezone = 'UTC';

-- Create the taskmate_user role
CREATE ROLE taskmate_user WITH LOGIN PASSWORD 'taskmate_password';

-- Grant necessary permissions to taskmate_user
ALTER ROLE taskmate_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE taskmate TO taskmate_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taskmate_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taskmate_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO taskmate_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO taskmate_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO taskmate_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO taskmate_user;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'TaskMate database initialized successfully';
END $$; 