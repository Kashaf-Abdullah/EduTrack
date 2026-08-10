import express from 'express';
import {
  getPendingUsers,
  approveUser,
  getApprovedUsers,
  getApprovedUsersByRole,
  getUserById,
  impersonateUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/pending', getPendingUsers);
router.get('/approved', getApprovedUsers);
router.get('/approved/:role', getApprovedUsersByRole);
router.get('/:id', getUserById);
router.post('/:id/impersonate', impersonateUser);

router.put('/approve/:id', approveUser);

export default router;
