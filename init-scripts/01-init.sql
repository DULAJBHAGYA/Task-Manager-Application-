-- TaskMate Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS taskmate_schema;

-- Set timezone
SET timezone = 'UTC';

-- Create any additional users or roles if needed
-- CREATE ROLE taskmate_app_user WITH LOGIN PASSWORD 'app_password';

-- Grant permissions
-- GRANT ALL PRIVILEGES ON DATABASE taskmate TO taskmate_app_user;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'TaskMate database initialized successfully';
END $$; 