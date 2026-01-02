import express from 'express';
import {
  completeStudentProfile,
  completeProfessorProfile,
  getProfile,
  updateProfile,
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { validateStudentProfile, validateProfessorProfile } from '../middleware/validateProfile.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/complete/student', validateStudentProfile, completeStudentProfile);
router.post('/complete/professor', validateProfessorProfile, completeProfessorProfile);
router.get('/', getProfile);
router.put('/', updateProfile);

export default router;

