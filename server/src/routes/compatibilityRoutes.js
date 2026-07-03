import { Router } from 'express';
import {
  getCompatibilityScore,
  getStoredScore,
} from '../controllers/compatibilityController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

// All compatibility routes require authentication
router.use(protect);

// Compute (and store) a compatibility score
router.post('/score', getCompatibilityScore);

// Retrieve previously computed score
router.get('/listing/:listingId', getStoredScore);

export default router;
