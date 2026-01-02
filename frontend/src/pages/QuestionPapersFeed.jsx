import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionPaperService } from '../services/questionPaperService';
import { authService } from '../services/authService';
import '../styles/Feed.css';

const QuestionPapersFeed = () => {
  const [questionPapers, setQuestionPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    subject: '',
    year: '',
    examType: '',
    sortBy: 'createdAt',
    order: 'desc',
  });
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const navigate = useNavigate();

  const departments = ['CSE', 'AI & DS', 'AI & ML', 'CYBER', 'MECH', 'ECE'];
  const examTypes = ['Midterm', 'Endterm', 'Quiz', 'Assignment', 'Other'];

  useEffect(() => {
    fetchQuestionPapers();
  }, [filters, pagination.page]);

  const fetchQuestionPapers = async () => {
    setLoading(true);
    try {
      const response = await questionPaperService.getQuestionPapers({
        ...filters,
        page: pagination.page,
        limit: 20,
      });
      setQuestionPapers(response.questionPapers);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching question papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleLike = async (qpId) => {
    try {
      await questionPaperService.likeQuestionPaper(qpId);
      fetchQuestionPapers();
    } catch (error) {
      console.error('Error liking question paper:', error);
    }
  };

  const handleReport = async (qpId) => {
    const reason = prompt('Please provide a reason for reporting:');
    if (reason) {
      try {
        await questionPaperService.reportQuestionPaper(qpId, reason);
        alert('Question paper reported successfully');
      } catch (error) {
        console.error('Error reporting question paper:', error);
      }
    }
  };

  const handleDownload = async (qp) => {
    try {
      await questionPaperService.incrementDownload(qp._id);
      window.open(qp.fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading question paper:', error);
    }
  };

  const handlePreview = (qp) => {
    navigate(`/document/question-paper/${qp._id}`);
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
            <button className="nav-link" onClick={() => navigate('/notes')}>
              Notes
            </button>
            <button className="nav-link active" onClick={() => navigate('/question-papers')}>
              Question Papers
            </button>
            <button className="nav-link" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button
              className="nav-link"
              onClick={() => navigate('/upload/question-paper')}
            >
              Upload QP
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
          <h1>Question Papers Feed</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/upload/question-paper')}
          >
            + Upload Question Paper
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

          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            placeholder="Year (e.g., 2023)"
            min="2000"
            max={new Date().getFullYear()}
          />

          <select name="examType" value={filters.examType} onChange={handleFilterChange}>
            <option value="">All Exam Types</option>
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="createdAt">Sort by Date</option>
            <option value="likeCount">Sort by Likes</option>
            <option value="downloadCount">Sort by Downloads</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading question papers...</div>
        ) : questionPapers.length === 0 ? (
          <div className="empty-state">No question papers found. Be the first to upload!</div>
        ) : (
          <>
            <div className="notes-grid">
              {questionPapers.map((qp) => (
                <div key={qp._id} className="note-card">
                  <div className="note-header">
                    <h3>{qp.title}</h3>
                  </div>
                  {qp.description && <p className="note-description">{qp.description}</p>}
                  <div className="note-meta">
                    <span>{qp.department}</span>
                    <span>Sem {qp.semester}</span>
                    <span>{qp.subject}</span>
                    <span>Year: {qp.year}</span>
                    <span>{qp.examType}</span>
                  </div>
                  <div className="note-stats">
                    <span>👤 {qp.uploadedBy?.name || 'Unknown'}</span>
                    <span>❤️ {qp.likeCount}</span>
                    <span>⬇️ {qp.downloadCount}</span>
                  </div>
                  <div className="note-actions">
                    <button className="btn btn-primary" onClick={() => handlePreview(qp)}>
                      Preview
                    </button>
                    <button className="btn btn-outline" onClick={() => handleDownload(qp)}>
                      Download
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleLike(qp._id)}
                      title="Like"
                    >
                      ❤️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleReport(qp._id)}
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

export default QuestionPapersFeed;

