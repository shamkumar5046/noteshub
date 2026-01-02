import express from 'express';
import passport from '../config/passport.js';
import {
  sendOTP,
  verifyOTP,
  googleCallback,
  getCurrentUser,
  dummyLogin,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Email OTP routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Dummy Login (Development Only)
router.post('/dummy-login', dummyLogin);

// Google OAuth routes (only if configured)
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || '';
const hasGoogleOAuth = googleClientId !== '' && googleClientId !== 'your_google_client_id';

if (hasGoogleOAuth) {
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);
} else {
  router.get('/google', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured',
    });
  });
}

// Status endpoint for Google OAuth (always available for frontend to check)
router.get('/google/status', (req, res) => {
  if (hasGoogleOAuth) {
    res.json({
      success: true,
      enabled: true,
      message: 'Google OAuth is configured',
    });
  } else {
    res.status(503).json({
      success: false,
      enabled: false,
      message: 'Google OAuth is not configured',
    });
  }
});

// Get current user
router.get('/me', authenticate, getCurrentUser);

export default router;

