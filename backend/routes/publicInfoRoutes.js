import express from 'express';
import {
  getPublicInfo,
  createPublicInfo,
  updatePublicInfo,
  deletePublicInfo
} from '../controllers/publicInfoController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all visible public info
router.get('/', getPublicInfo);

// Routes protected and accessible only by admin
router.post('/', protect, admin, createPublicInfo);
router.put('/:id', protect, admin, updatePublicInfo);
router.delete('/:id', protect, admin, deletePublicInfo);

export default router;
