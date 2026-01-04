# Authentication Guide

This guide explains the JWT-based authentication system implemented in the My-Personal-Dashboard application.

## Overview

The application now uses JWT (JSON Web Token) authentication with tokens that are valid for **7 days**. Users must sign in or sign up to access the dashboard.

## Features

- ✅ **Sign In Page** - Users can sign in with their email and password
- ✅ **Sign Up Page** - New users can create an account
- ✅ **JWT Tokens** - Secure authentication with 7-day token expiration
- ✅ **Persistent Sessions** - Users remain logged in across browser sessions
- ✅ **Sign Out** - Users can sign out to clear their session
- ✅ **Protected Routes** - Dashboard is only accessible when authenticated

## Architecture

### Backend (My-Personal-Backend)

#### Endpoints

1. **POST `/api/users/signup`**
   - Creates a new user account
   - Returns JWT token and user data
   - Token expires in 7 days

2. **POST `/api/users/signin`**
   - Authenticates existing user
   - Returns JWT token and user data
   - Token expires in 7 days

#### JWT Configuration

The JWT secret is configured via environment variable:

```env
JWT_SECRET=your-secret-key-change-in-production
```

**IMPORTANT**: Change this secret in production!

### Frontend (My-Personal-Dashboard)

#### File Structure

```
src/
├── pages/
│   ├── SignIn.tsx          # Sign in page
│   ├── SignIn.css          # Sign in styles
│   ├── SignUp.tsx          # Sign up page
│   └── SignUp.css          # Sign up styles
├── utils/
│   └── auth.ts             # Authentication utilities
├── services/
│   └── api.ts              # API calls (includes signIn/signUp)
└── App.tsx                 # Main app with auth routing
```

#### Authentication Flow

1. **On App Load**
   - Check localStorage for existing auth token
   - Verify token hasn't expired (7-day check)
   - If valid, load user data and show dashboard
   - If invalid/expired, show sign in page

2. **Sign In**
   - User enters email and password
   - Password is encoded (base64 - **demo only, use bcrypt in production**)
   - API call to `/api/users/signin`
   - Store JWT token with 7-day expiration timestamp
   - Redirect to dashboard

3. **Sign Up**
   - User enters name, email, and password
   - Validate password match and length
   - API call to `/api/users/signup`
   - Store JWT token with 7-day expiration timestamp
   - Redirect to dashboard

4. **Sign Out**
   - Clear all auth data from localStorage
   - Redirect to sign in page

#### Token Storage

Tokens are stored in localStorage with the following keys:

- `auth_token` - The JWT token
- `user_data` - Serialized user object (id, name, email)
- `token_expiry` - ISO timestamp of token expiration (7 days from creation)

#### Auth Utility Functions

```typescript
// Store authentication data
setAuthData({ token, user })

// Get authentication data (returns null if expired)
getAuthData()

// Check if user is authenticated
isAuthenticated()

// Clear all authentication data
clearAuth()
```

## Security Considerations

### Current Implementation (Demo)

⚠️ **This is a demo implementation. For production, you MUST:**

1. **Password Hashing**
   - Currently using base64 encoding (NOT SECURE)
   - Use bcrypt or similar on the backend
   ```typescript
   const bcrypt = require('bcrypt');
   const passwordHash = await bcrypt.hash(password, 10);
   ```

2. **HTTPS**
   - Use HTTPS in production to prevent token interception
   - Never send JWT tokens over unencrypted connections

3. **JWT Secret**
   - Use a strong, random secret key
   - Store in environment variables
   - Never commit to version control

4. **Token Refresh**
   - Consider implementing token refresh for better UX
   - Short-lived access tokens + long-lived refresh tokens

5. **CORS**
   - Configure proper CORS settings for your domain
   - Don't use `*` wildcard in production

## Usage

### Starting the Application

1. **Backend**
   ```bash
   cd My-Personal-Backend
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd My-Personal-Dashboard
   npm run dev
   ```

### First Time Setup

1. Navigate to the application (default: http://localhost:5173)
2. You'll see the Sign In page
3. Click "Sign up" to create an account
4. Fill in your details and submit
5. You'll be automatically logged in and see the dashboard

### Subsequent Visits

- If you visit within 7 days, you'll stay logged in automatically
- After 7 days, the token expires and you'll need to sign in again
- Click "Sign Out" to manually end your session

## Token Expiration

The token is valid for **7 days** from creation. After expiration:

- User will be automatically logged out
- Must sign in again to access the dashboard
- All localStorage auth data is cleared

## Troubleshooting

### "Invalid email or password" error
- Check that you're using the correct credentials
- Ensure the backend is running
- Check backend logs for errors

### Token expired immediately
- Check system time is correct
- Verify token_expiry in localStorage

### Can't stay logged in
- Check browser isn't clearing localStorage
- Ensure cookies/local storage are enabled

### Backend connection errors
- Verify backend is running on port 3001
- Check API_BASE_URL in `src/services/api.ts`
- Ensure database is running

## API Response Format

### Sign Up / Sign In Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "error": "Invalid email or password"
}
```

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub, etc.)
- [ ] Remember me option
- [ ] Session management (view active sessions)
- [ ] Account settings page

