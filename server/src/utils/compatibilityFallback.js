/**
 * Rule-based compatibility scoring fallback.
 * Used when no AI/LLM service is configured.
 *
 * @param {Object} tenant - tenant preferences object
 * @param {Object} listing - listing data object
 * @returns {{ score: number, explanation: string, source: 'fallback' }}
 */
const compatibilityFallback = (tenant, listing) => {
  const factors = [];
  let totalScore = 0;
  let maxScore = 0;

  // --- Budget Match (40 points) ---
  maxScore += 40;
  if (tenant.budget && listing.rent) {
    const budget = Number(tenant.budget);
    const rent = Number(listing.rent);

    if (rent <= budget) {
      totalScore += 40;
      factors.push('Rent is within your budget.');
    } else {
      const overshoot = (rent - budget) / budget;
      if (overshoot <= 0.1) {
        totalScore += 30;
        factors.push('Rent is slightly above budget (within 10%).');
      } else if (overshoot <= 0.25) {
        totalScore += 15;
        factors.push('Rent is moderately above budget.');
      } else {
        totalScore += 0;
        factors.push('Rent significantly exceeds your budget.');
      }
    }
  } else {
    // No budget info available — assume partial match
    totalScore += 20;
    maxScore -= 20;
    factors.push('Budget information not provided; partial match assumed.');
  }

  // --- Location Match (30 points) ---
  maxScore += 30;
  if (tenant.city && listing.city) {
    if (tenant.city.toLowerCase() === listing.city.toLowerCase()) {
      totalScore += 30;
      factors.push('Listing is in your preferred city.');
    } else {
      totalScore += 0;
      factors.push('Listing is in a different city than your preference.');
    }
  } else {
    totalScore += 15;
    maxScore -= 15;
    factors.push('City preference not provided; partial match assumed.');
  }

  // --- Room Type Match (20 points) ---
  maxScore += 20;
  if (tenant.roomType && listing.roomType) {
    if (
      tenant.roomType.toLowerCase() === listing.roomType.toLowerCase()
    ) {
      totalScore += 20;
      factors.push('Room type matches your preference.');
    } else {
      totalScore += 5;
      factors.push('Room type does not fully match your preference.');
    }
  } else {
    totalScore += 10;
    maxScore -= 10;
    factors.push('Room type preference not specified.');
  }

  // --- Gender Preference Match (10 points) ---
  maxScore += 10;
  if (listing.genderPreference && tenant.gender) {
    const pref = listing.genderPreference.toLowerCase();
    const gen = tenant.gender.toLowerCase();
    if (pref === 'any' || pref === gen) {
      totalScore += 10;
      factors.push('Gender preference is compatible.');
    } else {
      totalScore += 0;
      factors.push('Gender preference does not match this listing.');
    }
  } else {
    totalScore += 5;
    maxScore -= 5;
    factors.push('Gender preference not specified; assuming compatible.');
  }

  // Normalize to 0–100
  const normalizedScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const clampedScore = Math.min(100, Math.max(0, normalizedScore));

  return {
    score: clampedScore,
    explanation: factors.join(' '),
    source: 'fallback',
  };
};

export default compatibilityFallback;
