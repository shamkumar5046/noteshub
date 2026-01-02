import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notesService } from '../services/notesService';
import { questionPaperService } from '../services/questionPaperService';
import { authService } from '../services/authService';
import '../styles/DocumentViewer.css';

const DocumentViewer = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocument();
  }, [type, id]);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      let response;
      if (type === 'note') {
        response = await notesService.getNote(id);
        setDocument(response.note);
      } else if (type === 'question-paper') {
        response = await questionPaperService.getQuestionPaper(id);
        setDocument(response.questionPaper);
      }
    } catch (err) {
      setError('Failed to load document');
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (type === 'note') {
        await notesService.incrementDownload(id);
      } else {
        await questionPaperService.incrementDownload(id);
      }
      window.open(document.fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (type === 'note') {
        await notesService.likeNote(id);
      } else {
        await questionPaperService.likeQuestionPaper(id);
      }
      fetchDocument();
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  if (loading) {
    return (
      <div className="document-viewer-container">
        <div className="loading">Loading document...</div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="document-viewer-container">
        <div className="error-message">{error || 'Document not found'}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // Check if file is PDF for inline viewing
  const isPDF = document.fileType === 'application/pdf';

  return (
    <div className="document-viewer-container">
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
            <button className="nav-link" onClick={() => navigate('/profile')}>
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

      <div className="document-viewer-content">
        <div className="document-header">
          <div>
            <h1>{document.title}</h1>
            {document.description && <p className="document-description">{document.description}</p>}
            <div className="document-meta">
              <span>{document.department}</span>
              <span>Sem {document.semester}</span>
              <span>{document.subject}</span>
              {document.year && <span>Year: {document.year}</span>}
              {document.isVerified && <span className="verified-badge">✓ Verified</span>}
            </div>
            <div className="document-stats">
              <span>👤 {document.uploadedBy?.name || 'Unknown'}</span>
              <span>❤️ {document.likeCount}</span>
              <span>⬇️ {document.downloadCount}</span>
            </div>
          </div>
          <div className="document-actions">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download
            </button>
            <button className="btn btn-outline" onClick={handleLike}>
              ❤️ Like ({document.likeCount})
            </button>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>

        <div className="document-viewer">
          {isPDF ? (
            <iframe
              src={document.fileUrl}
              title={document.title}
              className="pdf-viewer"
            />
          ) : (
            <div className="non-pdf-viewer">
              <p>Preview not available for this file type.</p>
              <p>Please download to view: {document.fileType}</p>
              <button className="btn btn-primary" onClick={handleDownload}>
                Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;

