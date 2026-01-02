import Note from '../models/Note.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

// Upload Note
export const uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    const { title, description, department, semester, subject } = req.body;

    if (!title || !department || !semester || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Title, department, semester, and subject are required',
      });
    }

    // Upload to Cloudinary
    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'notes',
        req.file.mimetype === 'application/pdf' ? 'raw' : 'raw'
      );

      const note = await Note.create({
        title,
        description,
        uploadedBy: req.user._id,
        fileUrl: result.secure_url,
        filePublicId: result.public_id,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        department,
        semester: parseInt(semester),
        subject,
      });

      await note.populate('uploadedBy', 'name email');

      res.status(201).json({
        success: true,
        message: 'Note uploaded successfully',
        note,
      });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      
      // Provide helpful error message
      if (uploadError.message.includes('not configured')) {
        return res.status(500).json({
          success: false,
          message: 'File upload service is not configured. Please contact administrator.',
          error: uploadError.message,
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file. Please try again.',
        error: uploadError.message,
      });
    }
  } catch (error) {
    console.error('Upload note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Notes
export const getNotes = async (req, res) => {
  try {
    const {
      department,
      semester,
      subject,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    if (subject) query.subject = { $regex: subject, $options: 'i' };

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const notes = await Note.find(query)
      .populate('uploadedBy', 'name email')
      .populate('verifiedBy', 'name email')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Note.countDocuments(query);

    res.status(200).json({
      success: true,
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Note
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('verifiedBy', 'name email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Like Note
export const likeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    const userId = req.user._id;
    const isLiked = note.likes.includes(userId);

    if (isLiked) {
      note.likes = note.likes.filter((id) => id.toString() !== userId.toString());
      note.likeCount = note.likes.length;
    } else {
      note.likes.push(userId);
      note.likeCount = note.likes.length;
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Note unliked' : 'Note liked',
      likeCount: note.likeCount,
      isLiked: !isLiked,
    });
  } catch (error) {
    console.error('Like note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Report Note
export const reportNote = async (req, res) => {
  try {
    const { reason } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    const userId = req.user._id;

    // Check if already reported by this user
    const alreadyReported = note.reports.some(
      (report) => report.reportedBy.toString() === userId.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this note',
      });
    }

    note.reports.push({
      reportedBy: userId,
      reason: reason || 'Low quality content',
    });
    note.reportCount = note.reports.length;
    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note reported successfully',
    });
  } catch (error) {
    console.error('Report note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Increment Download Count
export const incrementDownload = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    note.downloadCount += 1;
    await note.save();

    res.status(200).json({
      success: true,
      downloadCount: note.downloadCount,
    });
  } catch (error) {
    console.error('Increment download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Verify Note (Professor/Admin only)
export const verifyNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    if (req.user.role !== 'PROFESSOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only professors and admins can verify notes',
      });
    }

    note.isVerified = true;
    note.verifiedBy = req.user._id;
    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note verified successfully',
      note,
    });
  } catch (error) {
    console.error('Verify note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

