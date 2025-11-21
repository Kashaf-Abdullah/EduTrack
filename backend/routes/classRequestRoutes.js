import express from 'express';

import {
  submitClassRequest,
  getPendingRequestsForTeacher,
  approveClassRequest,
  rejectClassRequest,
   getRequestsByStudent
} from '../controllers/classRequestControllers.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', submitClassRequest);

router.get('/teacher/:teacherId', getPendingRequestsForTeacher);

router.post('/:requestId/approve', approveClassRequest);

router.post('/:requestId/reject', rejectClassRequest);

router.get('/student/:studentId', getRequestsByStudent);

export default router;
