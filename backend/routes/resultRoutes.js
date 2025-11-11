import express from 'express';
import { addOrUpdateResult, getResultsForStudent } from '../controllers/resultController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Teacher adds or updates a result
router.post('/', addOrUpdateResult);

// Get results for a student (param studentId), optional subjectId as query param
router.get('/:studentId', getResultsForStudent);

export default router;
