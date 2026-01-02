# Troubleshooting Guide

## Common Issues and Solutions

### 1. Port Already in Use (EADDRINUSE)

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Causes:**
- Another instance of the server is already running
- Another application is using port 5000
- Previous server instance didn't shut down properly

**Solutions:**

#### Windows:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Mac/Linux:
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)
```

#### Alternative: Change Port
Edit `backend/.env`:
```env
PORT=5001
```

### 2. Google OAuth Not Configured

**Error:**
```
TypeError: OAuth2Strategy requires a clientID option
```

**Solution:**
The server now handles this gracefully. If Google OAuth credentials are not set, the server will:
- Start successfully
- Show message: "Google OAuth not configured - using email OTP only"
- Email OTP authentication will still work

To enable Google OAuth:
1. Get credentials from Google Cloud Console
2. Add them to `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id
   GOOGLE_CLIENT_SECRET=your_actual_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

### 3. MongoDB Connection Issues

**Error:**
```
MongoServerError: Authentication failed
```

**Solutions:**
- Verify MongoDB connection string in `.env`
- Check if IP is whitelisted in MongoDB Atlas
- Verify database user credentials
- Ensure network access is allowed

### 4. Cloudinary Upload Fails

**Error:**
```
Invalid API Key
```

**Solutions:**
- Verify Cloudinary credentials in `.env`
- Check if credentials are correct in Cloudinary Dashboard
- Ensure API key and secret are not swapped

### 5. Email OTP Not Sending

**Error:**
```
Failed to send OTP email
```

**Solutions:**
- For Gmail: Use App Password (not regular password)
  - Enable 2-Step Verification
  - Generate App Password from Google Account settings
  - Use the 16-character app password in `EMAIL_PASS`
- Check spam folder
- Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`

## Server Improvements Made

### 1. Better Error Handling
- Server now shows helpful error messages when port is in use
- Provides instructions on how to fix the issue

### 2. Graceful Shutdown
- Handles SIGTERM and SIGINT signals
- Closes server connections properly before exiting

### 3. Optional Google OAuth
- Server can start without Google OAuth credentials
- Only initializes Google OAuth if valid credentials are provided

## Quick Commands

### Check if port is free:
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -ti:5000
```

### Kill all Node processes (use with caution):
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
pkill -f node
```

### Restart server:
```bash
cd backend
npm run dev
```

## Getting Help

If you encounter other issues:
1. Check the error message carefully
2. Verify all environment variables in `.env`
3. Check the console logs for more details
4. Ensure all dependencies are installed: `npm install`


