# Environment Variables Setup Guide

## Backend .env File Setup

Create a file named `.env` in the `backend/` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas
# Get your connection string from: https://www.mongodb.com/cloud/atlas
# Format: mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
MONGODB_URI=your_mongodb_atlas_connection_string_here

# JWT Secret
# Generate a random string for production (e.g., use: openssl rand -base64 32)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_use_random_string

# Google OAuth
# Get credentials from: https://console.cloud.google.com
# 1. Create a new project
# 2. Enable Google+ API
# 3. Create OAuth 2.0 Client ID
# 4. Add redirect URI: http://localhost:5000/api/auth/google/callback
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (Gmail)
# For Gmail, you need to:
# 1. Enable 2-Step Verification in your Google Account
# 2. Generate an App Password: Security → 2-Step Verification → App passwords
# 3. Use the generated app password (not your regular password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password_here
EMAIL_FROM=noreply@collegeedtech.com

# Cloudinary
# Get credentials from: https://cloudinary.com
# Sign up for free account and get credentials from Dashboard
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Frontend .env File Setup (Optional)

Create a file named `.env` in the `frontend/` directory with the following content:

```env
# Frontend Environment Variables
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

## Quick Setup Commands

### Windows (PowerShell)
```powershell
# Backend
cd backend
Copy-Item .env.example .env
# Then edit .env with your credentials

# Frontend (optional)
cd ../frontend
New-Item .env -ItemType File
# Add: VITE_API_URL=http://localhost:5000/api
```

### Mac/Linux
```bash
# Backend
cd backend
cp .env.example .env
# Then edit .env with your credentials

# Frontend (optional)
cd ../frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

## Minimum Required Variables for Testing

For basic testing, you only need:

**Backend:**
- `MONGODB_URI` (Required)
- `JWT_SECRET` (Required - can be any random string for development)
- `FRONTEND_URL` (Required)

**Optional (but recommended):**
- Cloudinary credentials (for file uploads)
- Email credentials (for OTP)
- Google OAuth credentials (for Google login)

## Step-by-Step Setup

### 1. MongoDB Atlas (Required)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist IP: `0.0.0.0/0` (for development) or your IP
6. Get connection string and replace in `MONGODB_URI`

### 2. Cloudinary (Required for File Uploads)
1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to Dashboard
4. Copy:
   - Cloud Name → `CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

### 3. Gmail App Password (For Email OTP)
1. Go to your Google Account: https://myaccount.google.com
2. Security → 2-Step Verification (enable if not enabled)
3. Security → App passwords
4. Select "Mail" and "Other (Custom name)"
5. Generate password
6. Copy the 16-character password to `EMAIL_PASS`
7. Use your Gmail address in `EMAIL_USER`

### 4. Google OAuth (For Google Login)
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable "Google+ API"
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### 5. JWT Secret
Generate a secure random string:
```bash
# Mac/Linux
openssl rand -base64 32

# Or use any random string for development
```

## Testing Your Setup

After setting up `.env` files:

1. **Test Backend:**
   ```bash
   cd backend
   npm start
   ```
   Should see: "MongoDB Connected" and "Server running on port 5000"

2. **Test Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Should open at http://localhost:5173

## Troubleshooting

- **MongoDB connection fails**: Check connection string, IP whitelist, and credentials
- **Cloudinary upload fails**: Verify all three credentials are correct
- **Email not sending**: Check Gmail App Password (not regular password)
- **Google OAuth fails**: Verify callback URL matches exactly
- **CORS errors**: Ensure `FRONTEND_URL` matches your frontend URL


