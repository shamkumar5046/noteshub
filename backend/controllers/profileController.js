import User from '../models/User.js';

// Complete Student Profile
export const completeStudentProfile = async (req, res) => {
  try {
    const { name, rollNumber, department, year, semester } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.role !== 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'Only students can complete student profile',
      });
    }

    user.name = name;
    user.rollNumber = rollNumber;
    user.department = department;
    user.year = year;
    user.semester = semester;
    user.profileCompleted = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Student profile completed successfully',
      user,
    });
  } catch (error) {
    console.error('Complete student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Complete Professor Profile
export const completeProfessorProfile = async (req, res) => {
  try {
    const { name, collegeName, subjects } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.role !== 'PROFESSOR') {
      return res.status(403).json({
        success: false,
        message: 'Only professors can complete professor profile',
      });
    }

    user.name = name;
    user.collegeName = collegeName;
    user.subjects = subjects;
    user.profileCompleted = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Professor profile completed successfully',
      user,
    });
  } catch (error) {
    console.error('Complete professor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.email;
    delete updates.role;
    delete updates.password;
    delete updates.googleId;
    delete updates.isEmailVerified;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password -otp');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

