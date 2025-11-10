import express from 'express';
import { getPendingUsers, approveUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/pending', getPendingUsers);
router.put('/approve/:id', approveUser);

export default router;
