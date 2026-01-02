import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleOAuthEnabled, setGoogleOAuthEnabled] = useState(true); // Default to true, will check
  const [showDummyLogin, setShowDummyLogin] = useState(false);
  const [dummyRole, setDummyRole] = useState('STUDENT');
  const navigate = useNavigate();
  
  // Show dummy login in development (check if localhost)
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    // Check if Google OAuth is enabled
    authService.checkGoogleOAuth()
      .then(enabled => setGoogleOAuthEnabled(enabled))
      .catch(() => setGoogleOAuthEnabled(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.sendOTP(email);
      
      // In development mode, show OTP if provided
      if (response?.debug?.otp) {
        alert(`Development Mode: Your OTP is ${response.debug.otp}\n\nCheck the server console for more details.`);
      }
      
      navigate('/otp-verify', { state: { email } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      
      // Show additional help for email errors
      if (errorMessage.includes('Failed to send OTP email')) {
        console.error('Email error details:', err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleDummyLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.dummyLogin(email, dummyRole);
      if (response.user.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/profile-completion');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Dummy login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>College EdTech Platform</h1>
        <p className="subtitle">Sign in to access notes and question papers</p>

        {error && <div className="error-message">{error}</div>}

        {isDevelopment && (
          <div className="dummy-login-section">
            <button
              type="button"
              className="btn-dummy-toggle"
              onClick={() => setShowDummyLogin(!showDummyLogin)}
            >
              {showDummyLogin ? 'Hide' : 'Show'} Dummy Login (Dev Only)
            </button>
            
            {showDummyLogin && (
              <div className="dummy-login-form">
                <p className="dummy-warning">⚠️ Development Mode Only - Bypasses OTP</p>
                <form onSubmit={handleDummyLogin}>
                  <div className="form-group">
                    <label htmlFor="dummy-email">Email</label>
                    <input
                      type="email"
                      id="dummy-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="any@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dummy-role">Role</label>
                    <select
                      id="dummy-role"
                      value={dummyRole}
                      onChange={(e) => setDummyRole(e.target.value)}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="PROFESSOR">Professor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Dummy Login'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {!showDummyLogin && (
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
        )}

        {googleOAuthEnabled && (
          <>
            <div className="divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="btn btn-google"
              onClick={handleGoogleLogin}
            >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

