import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionPaperService } from '../services/questionPaperService';
import '../styles/Upload.css';

const UploadQuestionPaper = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    semester: '',
    subject: '',
    year: '',
    examType: 'Endterm',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const departments = ['CSE', 'AI & DS', 'AI & ML', 'CYBER', 'MECH', 'ECE'];
  const examTypes = ['Midterm', 'Endterm', 'Quiz', 'Assignment', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX are allowed.');
        return;
      }

      // Validate file size (100 MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100 MB.');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('department', formData.department);
      uploadFormData.append('semester', formData.semester);
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('year', formData.year);
      uploadFormData.append('examType', formData.examType);

      await questionPaperService.uploadQuestionPaper(uploadFormData);
      setSuccess('Question paper uploaded successfully!');
      setTimeout(() => {
        navigate('/question-papers');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload question paper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
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
          </div>
        </div>
      </nav>

      <div className="upload-content">
        <div className="upload-card">
          <h1>Upload Question Paper</h1>
          <p className="subtitle">Share previous year question papers</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter question paper title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description (optional)"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester *</label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter subject name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2023"
                  min="2000"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="examType">Exam Type *</label>
              <select
                id="examType"
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                required
              >
                {examTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="file">File * (PDF, DOC, DOCX, PPT, PPTX - Max 100MB)</label>
              <input
                type="file"
                id="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange}
                required
              />
              {file && (
                <p className="file-info">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Question Paper'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadQuestionPaper;

