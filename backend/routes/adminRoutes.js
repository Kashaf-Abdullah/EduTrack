import express from 'express';
import {
  removeStudentFromSubject,
  deleteStudent
  
} from '../controllers/subjectController.js';
import { protect,admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/remove-student-from-subject', admin,removeStudentFromSubject);
router.delete('/student/:studentId', admin, deleteStudent);

export default router;