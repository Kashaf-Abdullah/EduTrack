import express from 'express';
import { addOrUpdateResult, getResultsForStudent } from '../controllers/resultController.js';
import { protect } from '../middleware/authMiddleware.js';
import resultModel from '../models/resultModel.js';

const router = express.Router();

router.use(protect);

// Teacher adds or updates a result
router.post('/', addOrUpdateResult);

// Get results for a student (param studentId), optional subjectId as query param
router.get('/:studentId', getResultsForStudent);

router.get('/teacher/:teacherId', async (req, res) => {
  try {
    if (req.user._id !== req.params.teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const results = await Result.find({ teacher: req.params.teacherId })
      .populate('student', 'name email')
      .populate('subject', 'name')
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
