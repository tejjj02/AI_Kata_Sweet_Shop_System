# Authentication Guide

## Overview

The Sweet Shop System now includes JWT-based authentication to secure all API endpoints. Users must register and login to access the sweet management features.

## Features

✅ User Registration with email and password
✅ Secure Login with JWT tokens
✅ Password hashing with bcrypt
✅ Protected API routes requiring authentication
✅ Token-based session management (24-hour expiration)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Endpoints (Public)

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2025-11-03T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2025-11-03T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Endpoints (Require Authentication)

All `/api/sweets/*` endpoints now require a valid JWT token in the Authorization header.

#### Example: Get All Sweets
```http
GET /api/sweets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Testing with cURL

### Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Access Protected Route
```bash
# Save the token from login response
TOKEN="your-jwt-token-here"

curl -X GET http://localhost:3000/api/sweets \
  -H "Authorization: Bearer $TOKEN"
```

## Testing with Postman

1. **Register/Login:**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register` or `/login`
   - Body: JSON with email and password
   - Copy the `token` from response

2. **Access Protected Routes:**
   - Method: GET/POST/PUT/DELETE
   - URL: `http://localhost:3000/api/sweets/...`
   - Headers: 
     - Key: `Authorization`
     - Value: `Bearer YOUR_TOKEN_HERE`

## Security Features

### Password Requirements
- Minimum 6 characters
- Automatically hashed using bcrypt (10 salt rounds)
- Never stored or returned in plain text

### JWT Tokens
- Secret key: Configurable via `JWT_SECRET` environment variable
- Default expiration: 24 hours
- Contains: userId and email
- Automatically validated on protected routes

### Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**401 Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**400 User Already Exists:**
```json
{
  "success": false,
  "message": "User already exists"
}
```

**401 Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Implementation Details

### Files Created

1. **src/models/User.js** - User model with validation and password handling
2. **src/repositories/UserRepository.js** - Database operations for users
3. **src/services/AuthService.js** - Authentication business logic
4. **src/api/authRoutes.js** - Authentication API endpoints
5. **src/api/authMiddleware.js** - JWT verification middleware

### Test Coverage

- **User Model Tests:** 10 tests
- **UserRepository Tests:** 5 tests
- **AuthService Tests:** 8 tests
- **Total Tests:** 91 tests (all passing)

## Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your-super-secret-key-change-in-production
PORT=3000
```

⚠️ **Important:** Always change the JWT_SECRET in production!

## UI Integration (Coming Soon)

The UI will be updated to include:
- Login/Register forms
- Token storage in localStorage
- Automatic token inclusion in API requests
- Session expiration handling
- Logout functionality

## Migration from Previous Version

If you were using the system before authentication:

1. Run database setup to create users table:
```bash
npm run setup-db
```

2. Register a new user account
3. Login to get a token
4. Update any API clients to include the token in headers

## Troubleshooting

### "No token provided" error
- Make sure you're including the Authorization header
- Format must be: `Bearer YOUR_TOKEN`

### "Invalid or expired token" error
- Token may have expired (24 hours)
- Login again to get a new token

### "User already exists" error
- Email is already registered
- Try logging in instead
- Use a different email address

## Next Steps

- [ ] Update UI with login/register forms
- [ ] Add password reset functionality
- [ ] Implement refresh tokens
- [ ] Add user profile management
- [ ] Implement role-based access control (admin/user)
