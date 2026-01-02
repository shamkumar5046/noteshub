import express from 'express';
import {
  uploadNote,
  getNotes,
  getNote,
  likeNote,
  reportNote,
  incrementDownload,
  verifyNote,
} from '../controllers/notesController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Upload note (authenticated users only)
router.post('/upload', authenticate, upload.single('file'), uploadNote);

// Get all notes (public, but authenticated users get better experience)
router.get('/', getNotes);

// Get single note
router.get('/:id', getNote);

// Like note (authenticated users only)
router.post('/:id/like', authenticate, likeNote);

// Report note (authenticated users only)
router.post('/:id/report', authenticate, reportNote);

// Increment download count
router.post('/:id/download', incrementDownload);

// Verify note (professor/admin only)
router.post('/:id/verify', authenticate, authorize('PROFESSOR', 'ADMIN'), verifyNote);

export default router;

