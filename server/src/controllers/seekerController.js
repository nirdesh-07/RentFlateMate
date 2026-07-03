import SeekerProfile from '../models/SeekerProfile.js';

/**
 * GET /api/seekers
 * Browse seeker profiles (room seekers or roommate seekers).
 *
 * Query params:
 *   searchingFor  — "room" | "roommate"
 *   city          — string (case-insensitive)
 *   locality      — string (case-insensitive)
 *   gender        — "male" | "female" | "other"
 *   lookingForGender — "male" | "female" | "any"
 *   minBudget     — number
 *   maxBudget     — number
 *   occupation    — string
 *   page          — number (default 1)
 *   limit         — number (default 20)
 */
export const getSeekers = async (req, res, next) => {
  try {
    const {
      searchingFor,
      city,
      locality,
      gender,
      lookingForGender,
      minBudget,
      maxBudget,
      occupation,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (searchingFor) filter.searchingFor = searchingFor;
    if (city) filter.city = { $regex: new RegExp(city, 'i') };
    if (locality) filter.locality = { $regex: new RegExp(locality, 'i') };
    if (gender) filter.gender = gender;
    if (lookingForGender) filter.lookingForGender = lookingForGender;
    if (occupation) filter.occupation = occupation;
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [seekers, total] = await Promise.all([
      SeekerProfile.find(filter)
        .populate('userId', 'name email profilePic')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      SeekerProfile.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: seekers,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/seekers/:id
 * Get a single seeker profile by ID.
 */
export const getSeekerById = async (req, res, next) => {
  try {
    const seeker = await SeekerProfile.findById(req.params.id).populate(
      'userId',
      'name email phone profilePic'
    );

    if (!seeker) {
      return res.status(404).json({
        success: false,
        message: 'Seeker profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: seeker,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/seekers/stats/cities
 * Returns profile counts grouped by city (for the city discovery section).
 */
export const getSeekerCityStats = async (req, res, next) => {
  try {
    const stats = await SeekerProfile.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$city',
          total: { $sum: 1 },
          roomSeekers: { $sum: { $cond: [{ $eq: ['$searchingFor', 'room'] }, 1, 0] } },
          roommateSeekers: { $sum: { $cond: [{ $eq: ['$searchingFor', 'roommate'] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
    ]);
    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
