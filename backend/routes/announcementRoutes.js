import express from 'express';
import { createAnnouncement, getAnnouncements } from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAnnouncements); // public or protected depending on your policy
router.post('/', protect, admin, createAnnouncement); // admin only

export default router;
