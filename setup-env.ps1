# PowerShell script to set up .env files
# Run this script from the project root: .\setup-env.ps1

Write-Host "Setting up environment files..." -ForegroundColor Green

# Backend .env.example
$backendEnvExample = @"
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas
# Get your connection string from: https://www.mongodb.com/cloud/atlas
# Format: mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secret
# Generate a random string for production (e.g., use: openssl rand -base64 32)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google OAuth
# Get credentials from: https://console.cloud.google.com
# 1. Create a new project
# 2. Enable Google+ API
# 3. Create OAuth 2.0 Client ID
# 4. Add redirect URI: http://localhost:5000/api/auth/google/callback
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (Gmail)
# For Gmail, you need to:
# 1. Enable 2-Step Verification in your Google Account
# 2. Generate an App Password: Security -> 2-Step Verification -> App passwords
# 3. Use the generated app password (not your regular password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@collegeedtech.com

# Cloudinary
# Get credentials from: https://cloudinary.com
# Sign up for free account and get credentials from Dashboard
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
"@

# Backend .env (copy of example)
$backendEnv = $backendEnvExample

# Frontend .env
$frontendEnv = @"
# Frontend Environment Variables
# Backend API URL
VITE_API_URL=http://localhost:5000/api
"@

# Create backend files
if (Test-Path "backend") {
    $backendEnvExample | Out-File -FilePath "backend\.env.example" -Encoding utf8 -NoNewline
    $backendEnv | Out-File -FilePath "backend\.env" -Encoding utf8 -NoNewline
    Write-Host "Created backend\.env.example" -ForegroundColor Green
    Write-Host "Created backend\.env" -ForegroundColor Green
} else {
    Write-Host "Backend directory not found" -ForegroundColor Red
}

# Create frontend files
if (Test-Path "frontend") {
    $frontendEnv | Out-File -FilePath "frontend\.env" -Encoding utf8 -NoNewline
    Write-Host "Created frontend\.env" -ForegroundColor Green
} else {
    Write-Host "Frontend directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Setup complete! Now edit the .env files with your actual credentials." -ForegroundColor Yellow
Write-Host "See SETUP_ENV.md for detailed instructions." -ForegroundColor Cyan
