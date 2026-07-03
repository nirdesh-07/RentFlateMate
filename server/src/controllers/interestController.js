import InterestRequest from '../models/InterestRequest.js';
import Listing from '../models/Listing.js';
import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';

/**
 * POST /api/interests
 * Tenant sends an interest request for a listing.
 */
export const createInterest = async (req, res, next) => {
  try {
    const { listingId, message } = req.body;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID is required.',
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.',
      });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This listing is no longer available.',
      });
    }

    // Prevent owner from sending interest to their own listing
    if (listing.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send interest to your own listing.',
      });
    }

    // Check if interest already exists (unique index will also catch this)
    const existing = await InterestRequest.findOne({
      tenantId: req.user._id,
      listingId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already sent interest for this listing.',
        data: existing,
      });
    }

    const interest = await InterestRequest.create({
      tenantId: req.user._id,
      ownerId: listing.ownerId,
      listingId,
      message: message || '',
    });

    // Notify the owner
    await Notification.create({
      userId: listing.ownerId,
      title: 'New Interest Received',
      message: `${req.user.name} is interested in your listing: ${listing.title}`,
      type: 'interest',
    });

    return res.status(201).json({
      success: true,
      message: 'Interest sent successfully.',
      data: interest,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/interests/my
 * Get all interests for the currently logged-in user (tenant or owner).
 */
export const getMyInterests = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    const filter =
      role === 'owner'
        ? { ownerId: userId }
        : { tenantId: userId };

    const interests = await InterestRequest.find(filter)
      .populate('tenantId', 'name email profilePic')
      .populate('ownerId', 'name email profilePic')
      .populate('listingId', 'title city locality rent roomType')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: interests,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/interests/:id/accept
 * Owner accepts an interest request and a chat room is created.
 */
export const acceptInterest = async (req, res, next) => {
  try {
    const interest = await InterestRequest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest request not found.',
      });
    }

    if (interest.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the listing owner can accept this request.',
      });
    }

    if (interest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Interest request is already ${interest.status}.`,
      });
    }

    interest.status = 'accepted';
    await interest.save();

    // Create chat room if it doesn't already exist
    let chat = await Chat.findOne({ interestId: interest._id });
    if (!chat) {
      chat = await Chat.create({
        participants: [interest.tenantId, interest.ownerId],
        listingId: interest.listingId,
        interestId: interest._id,
      });
    }

    // Notify the tenant
    await Notification.create({
      userId: interest.tenantId,
      title: 'Interest Accepted!',
      message: 'Your interest request has been accepted. You can now chat with the owner.',
      type: 'interest',
    });

    return res.status(200).json({
      success: true,
      message: 'Interest accepted. Chat room is ready.',
      data: { interest, chat },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/interests/:id/reject
 * Owner rejects an interest request.
 */
export const rejectInterest = async (req, res, next) => {
  try {
    const interest = await InterestRequest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest request not found.',
      });
    }

    if (interest.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the listing owner can reject this request.',
      });
    }

    if (interest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Interest request is already ${interest.status}.`,
      });
    }

    interest.status = 'rejected';
    await interest.save();

    // Notify the tenant
    await Notification.create({
      userId: interest.tenantId,
      title: 'Interest Update',
      message: 'Your interest request was not accepted this time.',
      type: 'interest',
    });

    return res.status(200).json({
      success: true,
      message: 'Interest request rejected.',
      data: interest,
    });
  } catch (err) {
    next(err);
  }
};
