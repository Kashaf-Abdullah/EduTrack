import express from 'express';
import { markAttendance, getAttendanceBySubject, getAttendanceByStudent,getAttendanceForTeacher } from '../controllers/attendanceController.js';
import { protect, protectStudent } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', markAttendance);
router.use(protect);

// Teacher marks attendance

// router.post('/student', protectStudent, markAttendanceByStudent);


// Get attendance by subject (teacher/admin)
router.get('/subject/:subjectId', getAttendanceBySubject);

// Get attendance by student (student/admin)
router.get('/student/:studentId', getAttendanceByStudent);
router.get('/teacher/:teacherId', getAttendanceForTeacher);

export default router;
