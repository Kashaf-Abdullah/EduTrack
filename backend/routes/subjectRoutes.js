import express from 'express';
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createSubject);
router.get('/', getSubjects);
router.get('/:id', getSubjectById);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
