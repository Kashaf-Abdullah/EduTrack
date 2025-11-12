import express from 'express';
import { markAttendance, getAttendanceBySubject, getAttendanceByStudent } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Teacher marks attendance
router.post('/', markAttendance);

// Get attendance by subject (teacher/admin)
router.get('/subject/:subjectId', getAttendanceBySubject);

// Get attendance by student (student/admin)
router.get('/student/:studentId', getAttendanceByStudent);

export default router;
