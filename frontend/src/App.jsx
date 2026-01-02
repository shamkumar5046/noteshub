import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import ProfileCompletion from './pages/ProfileCompletion';
import Dashboard from './pages/Dashboard';
import NotesFeed from './pages/NotesFeed';
import QuestionPapersFeed from './pages/QuestionPapersFeed';
import UploadNote from './pages/UploadNote';
import UploadQuestionPaper from './pages/UploadQuestionPaper';
import Profile from './pages/Profile';
import DocumentViewer from './pages/DocumentViewer';
import ProtectedRoute from './utils/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/otp-verify" element={<OTPVerification />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/profile-completion"
        element={
          <ProtectedRoute>
            <ProfileCompletion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <NotesFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/question-papers"
        element={
          <ProtectedRoute>
            <QuestionPapersFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload/note"
        element={
          <ProtectedRoute>
            <UploadNote />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload/question-paper"
        element={
          <ProtectedRoute>
            <UploadQuestionPaper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document/:type/:id"
        element={
          <ProtectedRoute>
            <DocumentViewer />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

