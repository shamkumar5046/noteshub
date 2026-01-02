import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2>College EdTech Platform</h2>
          <div className="nav-links">
            <button className="nav-link active" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className="nav-link" onClick={() => navigate('/notes')}>
              Notes
            </button>
            <button className="nav-link" onClick={() => navigate('/question-papers')}>
              Question Papers
            </button>
            <button className="nav-link" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button className="nav-link" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {user.name || user.email}!</h1>
          <p>Role: {user.role}</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate('/notes')}>
            <div className="card-icon">📚</div>
            <h3>Notes</h3>
            <p>Browse and download study notes</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/question-papers')}>
            <div className="card-icon">📄</div>
            <h3>Question Papers</h3>
            <p>Access previous year question papers</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/upload/note')}>
            <div className="card-icon">⬆️</div>
            <h3>Upload Note</h3>
            <p>Share your notes with others</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/upload/question-paper')}>
            <div className="card-icon">📤</div>
            <h3>Upload Question Paper</h3>
            <p>Contribute question papers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

