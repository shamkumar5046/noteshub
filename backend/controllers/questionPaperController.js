import QuestionPaper from '../models/QuestionPaper.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

// Upload Question Paper
export const uploadQuestionPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    const { title, description, department, semester, subject, year, examType } = req.body;

    if (!title || !department || !semester || !subject || !year) {
      return res.status(400).json({
        success: false,
        message: 'Title, department, semester, subject, and year are required',
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      'question-papers',
      req.file.mimetype === 'application/pdf' ? 'raw' : 'raw'
    );

    const questionPaper = await QuestionPaper.create({
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
      year: parseInt(year),
      examType: examType || 'Endterm',
    });

    await questionPaper.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Question paper uploaded successfully',
      questionPaper,
    });
  } catch (error) {
    console.error('Upload question paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Question Papers
export const getQuestionPapers = async (req, res) => {
  try {
    const {
      department,
      semester,
      subject,
      year,
      examType,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (year) query.year = parseInt(year);
    if (examType) query.examType = examType;

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const questionPapers = await QuestionPaper.find(query)
      .populate('uploadedBy', 'name email')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await QuestionPaper.countDocuments(query);

    res.status(200).json({
      success: true,
      questionPapers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get question papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Question Paper
export const getQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id).populate(
      'uploadedBy',
      'name email'
    );

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found',
      });
    }

    res.status(200).json({
      success: true,
      questionPaper,
    });
  } catch (error) {
    console.error('Get question paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Like Question Paper
export const likeQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found',
      });
    }

    const userId = req.user._id;
    const isLiked = questionPaper.likes.includes(userId);

    if (isLiked) {
      questionPaper.likes = questionPaper.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      questionPaper.likeCount = questionPaper.likes.length;
    } else {
      questionPaper.likes.push(userId);
      questionPaper.likeCount = questionPaper.likes.length;
    }

    await questionPaper.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Question paper unliked' : 'Question paper liked',
      likeCount: questionPaper.likeCount,
      isLiked: !isLiked,
    });
  } catch (error) {
    console.error('Like question paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Report Question Paper
export const reportQuestionPaper = async (req, res) => {
  try {
    const { reason } = req.body;
    const questionPaper = await QuestionPaper.findById(req.params.id);

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found',
      });
    }

    const userId = req.user._id;

    // Check if already reported by this user
    const alreadyReported = questionPaper.reports.some(
      (report) => report.reportedBy.toString() === userId.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this question paper',
      });
    }

    questionPaper.reports.push({
      reportedBy: userId,
      reason: reason || 'Low quality content',
    });
    questionPaper.reportCount = questionPaper.reports.length;
    await questionPaper.save();

    res.status(200).json({
      success: true,
      message: 'Question paper reported successfully',
    });
  } catch (error) {
    console.error('Report question paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Increment Download Count
export const incrementDownload = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found',
      });
    }

    questionPaper.downloadCount += 1;
    await questionPaper.save();

    res.status(200).json({
      success: true,
      downloadCount: questionPaper.downloadCount,
    });
  } catch (error) {
    console.error('Increment download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

