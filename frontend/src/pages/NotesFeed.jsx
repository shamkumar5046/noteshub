import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesService } from '../services/notesService';
import { authService } from '../services/authService';
import '../styles/Feed.css';

const NotesFeed = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    subject: '',
    sortBy: 'createdAt',
    order: 'desc',
  });
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const navigate = useNavigate();

  const departments = ['CSE', 'AI & DS', 'AI & ML', 'CYBER', 'MECH', 'ECE'];

  useEffect(() => {
    fetchNotes();
  }, [filters, pagination.page]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await notesService.getNotes({
        ...filters,
        page: pagination.page,
        limit: 20,
      });
      setNotes(response.notes);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleLike = async (noteId) => {
    try {
      await notesService.likeNote(noteId);
      fetchNotes();
    } catch (error) {
      console.error('Error liking note:', error);
    }
  };

  const handleReport = async (noteId) => {
    const reason = prompt('Please provide a reason for reporting:');
    if (reason) {
      try {
        await notesService.reportNote(noteId, reason);
        alert('Note reported successfully');
      } catch (error) {
        console.error('Error reporting note:', error);
      }
    }
  };

  const handleDownload = async (note) => {
    try {
      await notesService.incrementDownload(note._id);
      window.open(note.fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading note:', error);
    }
  };

  const handlePreview = (note) => {
    navigate(`/document/note/${note._id}`);
  };

  return (
    <div className="feed-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2>College EdTech Platform</h2>
          <div className="nav-links">
            <button className="nav-link" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className="nav-link active" onClick={() => navigate('/notes')}>
              Notes
            </button>
            <button className="nav-link" onClick={() => navigate('/question-papers')}>
              Question Papers
            </button>
            <button className="nav-link" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button className="nav-link" onClick={() => navigate('/upload/note')}>
              Upload Note
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

      <div className="feed-content">
        <div className="feed-header">
          <h1>Notes Feed</h1>
          <button className="btn btn-primary" onClick={() => navigate('/upload/note')}>
            + Upload Note
          </button>
        </div>

        <div className="filters">
          <select name="department" value={filters.department} onChange={handleFilterChange}>
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select name="semester" value={filters.semester} onChange={handleFilterChange}>
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            placeholder="Search by subject..."
          />

          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="createdAt">Sort by Date</option>
            <option value="likeCount">Sort by Likes</option>
            <option value="downloadCount">Sort by Downloads</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">No notes found. Be the first to upload!</div>
        ) : (
          <>
            <div className="notes-grid">
              {notes.map((note) => (
                <div key={note._id} className="note-card">
                  <div className="note-header">
                    <h3>{note.title}</h3>
                    {note.isVerified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>
                  {note.description && <p className="note-description">{note.description}</p>}
                  <div className="note-meta">
                    <span>{note.department}</span>
                    <span>Sem {note.semester}</span>
                    <span>{note.subject}</span>
                  </div>
                  <div className="note-stats">
                    <span>👤 {note.uploadedBy?.name || 'Unknown'}</span>
                    <span>❤️ {note.likeCount}</span>
                    <span>⬇️ {note.downloadCount}</span>
                  </div>
                  <div className="note-actions">
                    <button className="btn btn-primary" onClick={() => handlePreview(note)}>
                      Preview
                    </button>
                    <button className="btn btn-outline" onClick={() => handleDownload(note)}>
                      Download
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleLike(note._id)}
                      title="Like"
                    >
                      ❤️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleReport(note._id)}
                      title="Report"
                    >
                      ⚠️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="btn btn-outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotesFeed;

