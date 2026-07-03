import { Router } from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import protect from '../middleware/authMiddleware.js';
import roleGuard from '../middleware/roleMiddleware.js';

const router = Router();

// Public: browse all active listings
router.get('/', getListings);

// Public: get single listing
router.get('/:id', getListingById);

// Protected: owner only can create
router.post('/', protect, roleGuard('owner', 'admin'), createListing);

// Protected: owner or admin can update/delete
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

export default router;
