# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

### Step 2: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Step 3: Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📋 Required Environment Variables

### Backend (.env)

**Minimum required for testing:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_random_string_for_development
FRONTEND_URL=http://localhost:5173
```

**For full functionality, also add:**
- Cloudinary credentials (for file uploads)
- Email credentials (for OTP)
- Google OAuth credentials (for Google login)

## 🧪 Testing Without Full Setup

You can test the application with minimal setup:

1. **MongoDB Atlas** (Required)
   - Free tier available
   - Get connection string from Atlas dashboard

2. **Cloudinary** (Required for file uploads)
   - Free tier available
   - Sign up at cloudinary.com

3. **Email OTP** (Optional - can skip for testing)
   - Use Gmail with App Password
   - Or use a service like SendGrid

4. **Google OAuth** (Optional - can skip for testing)
   - Set up in Google Cloud Console
   - Or test with email OTP only

## 🎯 First User Flow

1. Go to http://localhost:5173
2. Click "Send OTP" (if email is configured) or use Google login
3. Complete your profile (Student or Professor)
4. Upload a note or question paper
5. Browse the feed

## ⚠️ Common Issues

### Backend won't start
- Check MongoDB connection string
- Ensure all required env variables are set
- Check if port 5000 is available

### File upload fails
- Verify Cloudinary credentials
- Check file size (max 100MB)
- Ensure file type is allowed (PDF, DOC, DOCX, PPT, PPTX)

### OTP email not sending
- Check Gmail App Password
- Verify EMAIL_USER and EMAIL_PASS in .env
- Check spam folder

### Google OAuth not working
- Verify callback URL matches exactly
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Ensure OAuth consent screen is configured

## 📚 Next Steps

1. Read the full README.md for detailed setup
2. Configure all services for production
3. Deploy to hosting platforms
4. Customize for your college

---

**Happy Coding! 🎓**

