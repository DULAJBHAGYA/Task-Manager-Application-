# TaskMate API Testing Guide

## Setup Instructions

### 1. Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Select the file: `TaskMate_API.postman_collection.json`
4. The collection will be imported with all endpoints

### 2. Start the Server
```bash
# Start database and server
./start-server.sh

# Or manually:
docker-compose up -d postgres
cd task-manager-server
npm run dev
```

### 3. Verify Server is Running
```bash
curl http://localhost:5001/health
```

## API Endpoints

### Authentication Endpoints

#### 1. Signup
- **Method**: POST
- **URL**: `http://localhost:5001/api/auth/signup`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Response**: Returns user data and JWT token

#### 2. Signin
- **Method**: POST
- **URL**: `http://localhost:5001/api/auth/signin`
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Response**: Returns user data and JWT token

#### 3. Get Current User
- **Method**: GET
- **URL**: `http://localhost:5001/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns current user data

#### 4. Logout
- **Method**: POST
- **URL**: `http://localhost:5001/api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

## Testing Steps

### Step 1: Health Check
1. Run "Health Check" request
2. Should return status 200 with server info

### Step 2: Signup
1. Run "Signup" request
2. Should return status 201 with user data and token
3. Token will be automatically saved to collection variables

### Step 3: Signin
1. Run "Signin" request
2. Should return status 200 with user data and token
3. Token will be automatically saved to collection variables

### Step 4: Get Current User
1. Run "Get Current User" request
2. Should return status 200 with user data
3. Uses the saved token automatically

### Step 5: Test Protected Routes
1. Run "Get Profile" request
2. Should return status 200 with user profile
3. Uses the saved token automatically

### Step 6: Logout
1. Run "Logout" request
2. Should return status 200 with success message

## Expected Responses

### Successful Signup Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Successful Signin Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "All fields are required"
}
```

### User Already Exists
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Unauthorized (No Token)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Invalid Token
```json
{
  "success": false,
  "message": "Invalid token."
}
```

## Testing Scenarios

### 1. New User Registration
1. Use a new email address
2. Fill all required fields
3. Verify token is returned

### 2. Existing User Login
1. Use registered email and password
2. Verify token is returned
3. Check lastLogin is updated

### 3. Invalid Login Attempts
1. Try wrong password
2. Try non-existent email
3. Try empty fields

### 4. Token Authentication
1. Use valid token for protected routes
2. Try without token
3. Try with invalid token

### 5. User Data Access
1. Access profile with valid token
2. Verify sensitive data (password) is not returned
3. Check user permissions

## Troubleshooting

### Server Not Running
```bash
# Check if server is running
curl http://localhost:5001/health

# Start server if needed
cd task-manager-server
npm run dev
```

### Database Issues
```bash
# Check database status
./verify-db.sh

# Restart database if needed
./docker-setup.sh restart
```

### Token Issues
1. Check if token is saved in collection variables
2. Verify token format in Authorization header
3. Check if token is expired

### Common Errors
- **500 Internal Server Error**: Check server logs
- **401 Unauthorized**: Check token validity
- **400 Bad Request**: Check request body format
- **404 Not Found**: Check endpoint URL 