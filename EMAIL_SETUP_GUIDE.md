# Email OTP Setup Guide

## Problem: "Failed to send OTP email"

If you're getting this error, here are the solutions:

## Solution 1: Development Mode (Quick Testing)

The server now has **development mode** built-in! If email is not configured or fails, the OTP will be:
- **Logged to the server console** (check your terminal where `npm run dev` is running)
- **Shown in an alert** on the frontend (in development mode only)

**To use this:**
1. Make sure `NODE_ENV=development` in your `backend/.env`
2. Try sending OTP - check the server console for the OTP
3. The OTP will be displayed in a format like:
   ```
   ========================================
   📧 OTP EMAIL (Development Mode)
   ========================================
   To: your@email.com
   OTP: 123456
   ========================================
   ```

## Solution 2: Configure Gmail (Production)

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter a name like "College EdTech Platform"
5. Click **Generate**
6. Copy the **16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Edit `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=abcdefghijklmnop  # The 16-character app password (no spaces)
EMAIL_FROM=noreply@collegeedtech.com
```

**Important:**
- Use the **App Password**, NOT your regular Gmail password
- Remove any spaces from the app password
- The app password is 16 characters without spaces

### Step 4: Test
1. Restart your server: `npm run dev`
2. Try sending OTP again
3. Check server logs for any errors

## Solution 3: Use Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

### Custom SMTP
```env
EMAIL_HOST=your.smtp.server.com
EMAIL_PORT=587  # or 465 for SSL
EMAIL_USER=your_username
EMAIL_PASS=your_password
```

## Troubleshooting

### Error: "Authentication failed" (EAUTH)
- **Cause:** Wrong password or not using App Password for Gmail
- **Fix:** 
  - For Gmail: Use App Password, not regular password
  - Check that EMAIL_USER and EMAIL_PASS are correct
  - Make sure there are no extra spaces

### Error: "Connection failed" (ECONNECTION)
- **Cause:** Wrong host or port
- **Fix:**
  - Verify EMAIL_HOST is correct
  - Check EMAIL_PORT (587 for TLS, 465 for SSL)
  - Check firewall/network settings

### Error: "Timeout"
- **Cause:** Network or firewall blocking
- **Fix:**
  - Check internet connection
  - Verify firewall allows outbound SMTP
  - Try different port (465 instead of 587)

### Email goes to Spam
- Add your email to contacts
- Check spam folder
- Use a professional EMAIL_FROM address

## Testing Email Configuration

The server will automatically verify email configuration on startup. Look for:
- ✅ `Email transporter is ready to send messages` - Email is configured correctly
- ❌ `Email transporter verification failed` - Check your credentials
- ⚠️ `Email not configured - OTP will be logged to console` - Using development mode

## Development vs Production

### Development Mode
- OTP is logged to console
- OTP shown in frontend alert (if enabled)
- No email sent (even if configured)

### Production Mode
- OTP sent via email only
- No console logging
- No frontend alerts

Set `NODE_ENV=production` in `.env` for production mode.

## Quick Test

1. **Start server:** `cd backend && npm run dev`
2. **Check console** for email transporter status
3. **Send OTP** from frontend
4. **Check:**
   - Server console for OTP (development mode)
   - Email inbox (if configured)
   - Server logs for errors

## Still Having Issues?

1. Check server console logs for detailed error messages
2. Verify all environment variables in `.env`
3. Test email credentials with a simple email client first
4. Check that port 587 is not blocked by firewall
5. For Gmail, ensure "Less secure app access" is not needed (use App Password instead)

