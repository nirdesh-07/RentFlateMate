import Compatibility from '../models/Compatibility.js';
import Listing from '../models/Listing.js';
import compatibilityFallback from '../utils/compatibilityFallback.js';

/**
 * POST /api/compatibility/score
 * Compute an AI or rule-based compatibility score between a tenant and listing.
 *
 * Body: { listingId, tenant: { budget, city, roomType, gender, preferences } }
 */
export const getCompatibilityScore = async (req, res, next) => {
  try {
    const { listingId, tenant } = req.body;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'listingId is required.',
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.',
      });
    }

    const tenantData = {
      budget: tenant?.budget,
      city: tenant?.city,
      roomType: tenant?.roomType,
      gender: tenant?.gender,
      preferences: tenant?.preferences || [],
    };

    // ---------- AI PLACEHOLDER ----------
    // To plug in OpenAI or another LLM:
    // 1. Set OPENAI_API_KEY in .env
    // 2. Replace the fallback block below with an API call
    // 3. Parse the response to extract { score, explanation }
    // ------------------------------------
    let result;

    const aiEnabled = Boolean(process.env.OPENAI_API_KEY);
    if (aiEnabled) {
      // AI integration point — not yet implemented
      // result = await callOpenAI(tenantData, listing);
      result = compatibilityFallback(tenantData, listing.toObject());
      result.source = 'ai'; // Update when real AI is plugged in
    } else {
      result = compatibilityFallback(tenantData, listing.toObject());
    }

    // Upsert: store or update the compatibility record
    const saved = await Compatibility.findOneAndUpdate(
      { tenantId: req.user._id, listingId: listing._id },
      {
        tenantId: req.user._id,
        listingId: listing._id,
        score: result.score,
        explanation: result.explanation,
        source: result.source,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        score: saved.score,
        explanation: saved.explanation,
        source: saved.source,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/compatibility/listing/:listingId
 * Get stored compatibility score for the logged-in tenant and a specific listing.
 */
export const getStoredScore = async (req, res, next) => {
  try {
    const record = await Compatibility.findOne({
      tenantId: req.user._id,
      listingId: req.params.listingId,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'No compatibility score found. Please compute one first.',
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};
