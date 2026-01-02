# College EdTech Platform – Notes & Question Paper Hub

A production-ready, full-stack EdTech web platform designed for colleges, where students and professors can securely authenticate, upload, manage, and consume academic resources such as notes and previous-year question papers.

## 🚀 Features

### Authentication & User Management
- **Email-based OTP authentication** with real email sending & verification
- **Google OAuth 2.0 login** integration
- **Role-based access control** with three roles:
  - STUDENT
  - PROFESSOR
  - ADMIN
- **Profile completion** for students and professors

### Notes & Question Paper Hub
- Separate sections for Notes and Question Papers
- **File upload support** for PDF, DOC, DOCX, PPT, PPTX
- **File size limit**: 100 MB
- **Department-based filtering**: CSE, AI & DS, AI & ML, CYBER, MECH, ECE
- **Semester-based tagging** (1–8)
- **Subject-based tagging**
- **Document preview** inside the browser (PDF)
- **Download functionality**
- **Like and report** low-quality content
- **Verification system** for notes (by professors)

### Storage & Data Management
- **Cloudinary** for cloud file storage
- **MongoDB Atlas** for metadata and user data
- Secure file handling and validation

### Frontend
- **React + Vite** for fast development
- **Plain CSS** (no Tailwind, no UI libraries)
- Clean white background with subtle color accents
- Premium, minimal, professional design
- Protected routes for authenticated users
- Responsive design

## 📁 Project Structure

```
cousor_1/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── cloudinary.js        # Cloudinary & Multer config
│   │   └── passport.js          # Google OAuth config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── notesController.js
│   │   └── questionPaperController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validateProfile.js   # Profile validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   └── QuestionPaper.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── notesRoutes.js
│   │   └── questionPaperRoutes.js
│   ├── utils/
│   │   ├── email.js             # Nodemailer config
│   │   ├── generateOTP.js
│   │   └── uploadToCloudinary.js
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   ├── AuthCallback.jsx
│   │   │   ├── ProfileCompletion.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NotesFeed.jsx
│   │   │   ├── QuestionPapersFeed.jsx
│   │   │   ├── UploadNote.jsx
│   │   │   ├── UploadQuestionPaper.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── DocumentViewer.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── profileService.js
│   │   │   ├── notesService.js
│   │   │   └── questionPaperService.js
│   │   ├── styles/
│   │   ├── utils/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for email OTP)
- Google Cloud Console project (for OAuth)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Atlas
   MONGODB_URI=your_mongodb_atlas_connection_string

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@collegeedtech.com

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file (optional):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Configuration Guide

### MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and add it to `.env`

### Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to `.env`

### Gmail Setup (for Email OTP)
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
4. Use this app password in `EMAIL_PASS` in `.env`

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user (protected)

### Profile
- `POST /api/profile/complete/student` - Complete student profile (protected)
- `POST /api/profile/complete/professor` - Complete professor profile (protected)
- `GET /api/profile` - Get profile (protected)
- `PUT /api/profile` - Update profile (protected)

### Notes
- `POST /api/notes/upload` - Upload note (protected)
- `GET /api/notes` - Get all notes (with filters)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes/:id/like` - Like note (protected)
- `POST /api/notes/:id/report` - Report note (protected)
- `POST /api/notes/:id/download` - Increment download count
- `POST /api/notes/:id/verify` - Verify note (professor/admin only)

### Question Papers
- `POST /api/question-papers/upload` - Upload question paper (protected)
- `GET /api/question-papers` - Get all question papers (with filters)
- `GET /api/question-papers/:id` - Get single question paper
- `POST /api/question-papers/:id/like` - Like question paper (protected)
- `POST /api/question-papers/:id/report` - Report question paper (protected)
- `POST /api/question-papers/:id/download` - Increment download count

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set all environment variables in your hosting platform
2. Ensure MongoDB Atlas allows connections from your hosting IP
3. Update `FRONTEND_URL` to your production frontend URL
4. Update `GOOGLE_CALLBACK_URL` to your production callback URL

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable `VITE_API_URL` to your production backend URL

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Input validation
- File type and size validation
- Role-based authorization

## 🎯 Future Enhancements
- Elasticsearch integration for advanced search
- Note versioning system
- Top-rated notes ranking
- Real-time notifications
- Comment system
- File preview for non-PDF files
- Admin dashboard

## 📝 License
This project is open source and available for educational purposes.

## 👥 Support
For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for the education community**

