import nodemailer from 'nodemailer';

// Check if email is configured
const isEmailConfigured = true;
  // process.env.EMAIL_HOST &&
  // process.env.EMAIL_USER &&
  // process.env.EMAIL_PASS &&
  // process.env.EMAIL_USER !== 'your_email@gmail.com' &&
  // process.env.EMAIL_PASS !== 'your_app_password';

const EMAIL_HOST='smtp.gmail.com';
const EMAIL_PORT=587
const EMAIL_USER='sham1309kumar@gmail.com';
const EMAIL_PASS='jomlnnuqncmrmkov';
const EMAIL_FROM='sham1309kumar@gmail.com';
const NODE_ENV='development';

let transporter = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // For development, set to true in production
    },
  });

  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email transporter is ready to send messages');
    }
  });
} else {
  console.log('⚠️  Email not configured - OTP will be logged to console in development mode');
}

export const sendOTPEmail = async (email, otp) => {
  // ALWAYS log OTP to console in development mode (for testing)
  const isDevelopment = NODE_ENV === 'development' || !process.env.NODE_ENV;
  
  if (isDevelopment) {
    console.log('\n========================================');
    console.log('📧 OTP EMAIL (Development Mode)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log('========================================\n');
  }

  // If email is not configured, return true in development mode
  if (!isEmailConfigured) {
    if (isDevelopment) {
      console.log('⚠️  Email not configured - OTP logged above. Update .env to send real emails.');
      return true; // Allow login in development even without email
    }
    return false; // Fail in production if email not configured
  }

  // Try to send email if configured
  try {
    // Clean password (remove spaces - Gmail app passwords sometimes have spaces)
    const cleanPassword = EMAIL_PASS?.replace(/\s/g, '') || EMAIL_PASS;
    
    // Create transporter with cleaned password
    const emailTransporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: cleanPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"College EdTech Platform" <${EMAIL_FROM || EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for College EdTech Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Your OTP for login is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
    if (isDevelopment) {
      console.log('📧 Email sent! OTP also logged above for testing.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
    });
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('💡 Authentication failed. Check your EMAIL_USER and EMAIL_PASS in .env');
      console.error('💡 For Gmail, make sure you are using an App Password (16 characters, no spaces)');
      console.error('💡 Current EMAIL_PASS has spaces - remove them or regenerate app password');
    } else if (error.code === 'ECONNECTION') {
      console.error('💡 Connection failed. Check your EMAIL_HOST and EMAIL_PORT in .env');
    }
    
    // In development mode, still return true even if email fails (OTP is in console)
    if (isDevelopment) {
      console.log('⚠️  Email failed but continuing in development mode. OTP logged above.');
      return true;
    }
    
    return false;
  }
};

