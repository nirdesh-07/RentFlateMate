import { Router } from 'express';
import {
  createInterest,
  getMyInterests,
  acceptInterest,
  rejectInterest,
} from '../controllers/interestController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

// All interest routes require authentication
router.use(protect);

router.post('/', createInterest);
router.get('/my', getMyInterests);
router.patch('/:id/accept', acceptInterest);
router.patch('/:id/reject', rejectInterest);

export default router;
