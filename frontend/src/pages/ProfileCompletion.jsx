import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import '../styles/ProfileCompletion.css';

const ProfileCompletion = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: '',
    year: '',
    semester: '',
    collegeName: '',
    subjects: [''],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('STUDENT');
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      setUserRole(user.role || 'STUDENT');
      if (user.name) setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = value;
    setFormData((prev) => ({ ...prev, subjects: newSubjects }));
  };

  const addSubject = () => {
    setFormData((prev) => ({ ...prev, subjects: [...prev.subjects, ''] }));
  };

  const removeSubject = (index) => {
    if (formData.subjects.length > 1) {
      const newSubjects = formData.subjects.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, subjects: newSubjects }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (userRole === 'STUDENT') {
        await profileService.completeStudentProfile({
          name: formData.name,
          rollNumber: formData.rollNumber,
          department: formData.department,
          year: parseInt(formData.year),
          semester: parseInt(formData.semester),
        });
      } else {
        await profileService.completeProfessorProfile({
          name: formData.name,
          collegeName: formData.collegeName,
          subjects: formData.subjects.filter((s) => s.trim() !== ''),
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['CSE', 'AI & DS', 'AI & ML', 'CYBER', 'MECH', 'ECE'];

  return (
    <div className="profile-completion-container">
      <div className="profile-completion-card">
        <h1>Complete Your Profile</h1>
        <p className="subtitle">
          {userRole === 'STUDENT'
            ? 'Please provide your student information'
            : 'Please provide your professor information'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          {userRole === 'STUDENT' ? (
            <>
              <div className="form-group">
                <label htmlFor="rollNumber">Roll Number *</label>
                <input
                  type="text"
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your roll number"
                />
              </div>

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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year *</label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
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
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="collegeName">College Name *</label>
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your college name"
                />
              </div>

              <div className="form-group">
                <label>Subjects You Teach *</label>
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="subject-input-group">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => handleSubjectChange(index, e.target.value)}
                      placeholder={`Subject ${index + 1}`}
                      required={index === 0}
                    />
                    {formData.subjects.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeSubject(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={addSubject}
                  style={{ marginTop: '10px' }}
                >
                  + Add Another Subject
                </button>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;

