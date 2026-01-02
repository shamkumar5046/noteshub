import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const profileCompleted = searchParams.get('profileCompleted') === 'true';

    if (token) {
      localStorage.setItem('token', token);
      
      // Fetch user data
      authService.getCurrentUser()
        .then((response) => {
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            
            if (response.user.profileCompleted || profileCompleted) {
              navigate('/dashboard');
            } else {
              navigate('/profile-completion');
            }
          }
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="loading">
      <p>Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;

