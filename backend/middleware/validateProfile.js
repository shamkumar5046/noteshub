export const validateStudentProfile = (req, res, next) => {
  const { name, rollNumber, department, year, semester } = req.body;

  if (!name || !rollNumber || !department || !year || !semester) {
    return res.status(400).json({
      success: false,
      message: 'All student profile fields are required: name, rollNumber, department, year, semester',
    });
  }

  const validDepartments = ['CSE', 'AI & DS', 'AI & ML', 'CYBER', 'MECH', 'ECE'];
  if (!validDepartments.includes(department)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid department',
    });
  }

  if (year < 1 || year > 4) {
    return res.status(400).json({
      success: false,
      message: 'Year must be between 1 and 4',
    });
  }

  if (semester < 1 || semester > 8) {
    return res.status(400).json({
      success: false,
      message: 'Semester must be between 1 and 8',
    });
  }

  next();
};

export const validateProfessorProfile = (req, res, next) => {
  const { name, collegeName, subjects } = req.body;

  if (!name || !collegeName || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'All professor profile fields are required: name, collegeName, subjects (array)',
    });
  }

  next();
};

