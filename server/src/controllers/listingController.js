import Listing from '../models/Listing.js';

/**
 * POST /api/listings
 * Create a new listing. Owner only.
 */
export const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      city,
      locality,
      address,
      rent,
      deposit,
      availableFrom,
      roomType,
      furnished,
      genderPreference,
      amenities,
      images,
    } = req.body;

    const listing = await Listing.create({
      ownerId: req.user._id,
      title,
      description,
      city,
      locality,
      address,
      rent,
      deposit,
      availableFrom,
      roomType,
      furnished,
      genderPreference,
      amenities: amenities || [],
      images: images || [],
    });

    return res.status(201).json({
      success: true,
      message: 'Listing created successfully.',
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/listings
 * Get all active listings with optional filters.
 * Query: city, minRent, maxRent, roomType, genderPreference, furnished
 */
export const getListings = async (req, res, next) => {
  try {
    const { city, minRent, maxRent, roomType, genderPreference, furnished, page = 1, limit = 20 } = req.query;

    const filter = { status: 'active' };

    if (city) filter.city = { $regex: new RegExp(city, 'i') };
    if (roomType) filter.roomType = roomType;
    if (genderPreference) filter.genderPreference = genderPreference;
    if (furnished) filter.furnished = furnished;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('ownerId', 'name email profilePic')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Listing.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: listings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/listings/:id
 * Get a single listing by ID.
 */
export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'ownerId',
      'name email phone profilePic'
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/listings/:id
 * Update a listing. Owner or admin only.
 */
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.',
      });
    }

    const isOwner = listing.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing.',
      });
    }

    const allowedFields = [
      'title', 'description', 'city', 'locality', 'address', 'rent',
      'deposit', 'availableFrom', 'roomType', 'furnished', 'genderPreference',
      'amenities', 'images', 'status',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    await listing.save();

    return res.status(200).json({
      success: true,
      message: 'Listing updated successfully.',
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/listings/:id
 * Delete a listing. Owner or admin only.
 */
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.',
      });
    }

    const isOwner = listing.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing.',
      });
    }

    await listing.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Listing deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
