import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="loading">No profile data found</div>;
  }

  return (
    <div className="profile-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2>College EdTech Platform</h2>
          <div className="nav-links">
            <button className="nav-link" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className="nav-link" onClick={() => navigate('/notes')}>
              Notes
            </button>
            <button className="nav-link" onClick={() => navigate('/question-papers')}>
              Question Papers
            </button>
            <button className="nav-link active" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button
              className="nav-link"
              onClick={() => {
                authService.logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-card">
          <h1>My Profile</h1>

          <div className="profile-section">
            <h2>Basic Information</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>Name:</label>
                <span>{user.name || 'Not set'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className="role-badge">{user.role}</span>
              </div>
              <div className="info-item">
                <label>Profile Status:</label>
                <span className={user.profileCompleted ? 'status-complete' : 'status-incomplete'}>
                  {user.profileCompleted ? '✓ Completed' : '✗ Incomplete'}
                </span>
              </div>
            </div>
          </div>

          {user.role === 'STUDENT' && (
            <div className="profile-section">
              <h2>Student Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <label>Roll Number:</label>
                  <span>{user.rollNumber || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Department:</label>
                  <span>{user.department || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Year:</label>
                  <span>{user.year ? `Year ${user.year}` : 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Semester:</label>
                  <span>{user.semester ? `Semester ${user.semester}` : 'Not set'}</span>
                </div>
              </div>
            </div>
          )}

          {user.role === 'PROFESSOR' && (
            <div className="profile-section">
              <h2>Professor Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <label>College Name:</label>
                  <span>{user.collegeName || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Subjects:</label>
                  <div className="subjects-list">
                    {user.subjects && user.subjects.length > 0 ? (
                      user.subjects.map((subject, index) => (
                        <span key={index} className="subject-tag">
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span>Not set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!user.profileCompleted && (
            <div className="profile-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/profile-completion')}
              >
                Complete Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

