import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Only initialize Google OAuth if credentials are provided and valid
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const hasGoogleCredentials = 
  googleClientId !== '' &&
  googleClientSecret !== '' &&
  googleClientId !== 'your_google_client_id' &&
  googleClientSecret !== 'your_google_client_secret';

if (hasGoogleCredentials) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // User exists, update Google ID if not set
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          } else {
            // Create new user
            user = await User.create({
              email: profile.emails[0].value,
              name: profile.displayName,
              googleId: profile.id,
              isEmailVerified: true,
              authMethod: 'google',
            });
            return done(null, user);
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  
  console.log('Google OAuth configured successfully');
} else {
  console.log('Google OAuth not configured - using email OTP only');
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

