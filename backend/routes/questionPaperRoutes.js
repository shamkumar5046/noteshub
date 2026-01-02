import express from 'express';
import {
  uploadQuestionPaper,
  getQuestionPapers,
  getQuestionPaper,
  likeQuestionPaper,
  reportQuestionPaper,
  incrementDownload,
} from '../controllers/questionPaperController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Upload question paper (authenticated users only)
router.post('/upload', authenticate, upload.single('file'), uploadQuestionPaper);

// Get all question papers (public, but authenticated users get better experience)
router.get('/', getQuestionPapers);

// Get single question paper
router.get('/:id', getQuestionPaper);

// Like question paper (authenticated users only)
router.post('/:id/like', authenticate, likeQuestionPaper);

// Report question paper (authenticated users only)
router.post('/:id/report', authenticate, reportQuestionPaper);

// Increment download count
router.post('/:id/download', incrementDownload);

export default router;

