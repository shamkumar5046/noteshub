import User from '../models/User.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ email });

    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      user = await User.create({
        email,
        otp,
        otpExpires,
        authMethod: 'email',
      });
    }

    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
      return res.status(500).json({
        success: false,
        message: isDevelopment 
          ? 'Email failed, but OTP is logged in server console. Check terminal where server is running.'
          : 'Failed to send OTP email. Please check server logs for details.',
        // In development, include OTP in response for testing
        ...(isDevelopment && {
          debug: {
            otp: otp,
            note: 'Check server console for OTP. This is only shown in development mode.',
          },
        }),
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Google OAuth Callback
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const token = generateToken(user._id);

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&profileCompleted=${user.profileCompleted}`
    );
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

// Dummy Login (Development Only) - Bypasses OTP
export const dummyLogin = async (req, res) => {
  try {
    // Only allow in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    if (!isDevelopment) {
      return res.status(403).json({
        success: false,
        message: 'Dummy login is only available in development mode',
      });
    }

    const { email, role = 'STUDENT' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name: email.split('@')[0], // Use email prefix as name
        isEmailVerified: true,
        authMethod: 'email',
        role: role.toUpperCase(),
      });
    } else {
      // Update user if needed
      user.isEmailVerified = true;
      if (role && ['STUDENT', 'PROFESSOR', 'ADMIN'].includes(role.toUpperCase())) {
        user.role = role.toUpperCase();
      }
      await user.save();
    }

    const token = generateToken(user._id);

    console.log(`\n🔓 DUMMY LOGIN (Development Mode)`);
    console.log(`Email: ${email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Token generated successfully\n`);

    res.status(200).json({
      success: true,
      message: 'Dummy login successful (Development Mode)',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error('Dummy login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

