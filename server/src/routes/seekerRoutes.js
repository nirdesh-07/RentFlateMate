import { Router } from 'express';
import {
  getSeekers,
  getSeekerById,
  getSeekerCityStats,
} from '../controllers/seekerController.js';

const router = Router();

// Public: city statistics for discovery sections
router.get('/stats/cities', getSeekerCityStats);

// Public: browse all seeker profiles (filterable, paginated)
router.get('/', getSeekers);

// Public: single seeker profile
router.get('/:id', getSeekerById);

export default router;
