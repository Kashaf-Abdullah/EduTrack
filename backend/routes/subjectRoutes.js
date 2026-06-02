import express from 'express';
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject, 
  addStudentToSubject,
  getSubjectsForStudent,
  getAllStudentSubjectDetailsForAdmin,
  getPendingSubjects,
  approveSubject,
  rejectSubject
} from '../controllers/subjectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createSubject);
router.get('/', getSubjects);
router.get('/:id', getSubjectById);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);
router.post('/:id/add-student', addStudentToSubject);
router.get('/student/enrolled', getSubjectsForStudent);
router.get('/admin/students', admin, getAllStudentSubjectDetailsForAdmin);

// Admin approval routes
router.get('/admin/pending-subjects', admin, getPendingSubjects);
router.post('/:subjectId/approve', admin, approveSubject);
router.post('/:subjectId/reject', admin, rejectSubject);

export default router;
