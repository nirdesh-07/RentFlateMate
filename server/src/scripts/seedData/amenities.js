/**
 * amenities.js — Listing generation data: amenities, title templates, descriptions.
 */

// ─── Amenity pools ─────────────────────────────────────────────────────────

export const COMMON_AMENITIES = ['WiFi', 'Water Supply', 'Power Backup'];

export const EXTRA_AMENITIES = [
  'AC', 'Washing Machine', 'Refrigerator', 'Geyser', 'Microwave',
  'TV', 'Inverter', 'Parking', 'Two-Wheeler Parking', 'CCTV',
  'Security Guard', 'Lift', 'Gym Access', 'Housekeeping', 'Laundry',
  'Meals Included', 'Cooking Gas', 'Modular Kitchen', 'Wardrobe',
  'Study Table', 'Balcony', 'Terrace Access', 'Garden', 'Swimming Pool',
  'Club House', 'Play Area', 'Pet Friendly', 'Intercom',
];

/** Pick a realistic amenity list for a listing */
export const pickAmenities = (pick, randInt, furnished) => {
  const base = [...COMMON_AMENITIES];
  const pool = [...EXTRA_AMENITIES];
  const shuffled = pool.sort(() => 0.5 - Math.random());
  const count = furnished === 'fully-furnished'
    ? randInt(4, 9)
    : furnished === 'semi-furnished'
    ? randInt(2, 5)
    : randInt(0, 2);
  return [...base, ...shuffled.slice(0, count)];
};

// ─── Listing title templates ───────────────────────────────────────────────

export const LISTING_TITLE_TEMPLATES = {
  room: [
    'Comfortable room available in {locality}, {city}',
    'Independent room for rent in {locality}',
    'Well-maintained room near main road, {locality}',
    'Single room for {gender} in {locality}, {city}',
    'Spacious room in residential area, {locality}',
    'Cozy room in {locality} — ideal for working professionals',
    'Quiet room for rent in {locality}, {city}',
    'Clean single room available near {locality}',
    'Bright airy room available, {locality}, {city}',
    'Room in friendly neighbourhood — {locality}',
  ],
  pg: [
    'PG accommodation for {gender} in {locality}, {city}',
    'Managed PG with meals — {locality}, {city}',
    'Safe & clean PG for working {gender} in {locality}',
    'PG with WiFi and food in {locality}',
    'Budget PG for students and professionals — {locality}',
    'Girls/Boys PG with all amenities, {locality}',
    'Comfortable PG near offices, {locality}, {city}',
    'Fully managed PG — {locality}, {city}',
    'PG with homely meals in {locality}',
    'Decent PG accommodation — {locality}',
  ],
  'shared-flat': [
    'Flatmates wanted for 2BHK in {locality}, {city}',
    'Shared 3BHK flat in {locality} — one vacancy',
    'Room in shared flat — {locality}, {city}',
    'Co-living in {locality} — looking for flatmate',
    '2BHK shared flat vacancy in {locality}',
    'Friendly flatshare available in {locality}, {city}',
    'Shared apartment with working professionals — {locality}',
    'Join our {locality} flatshare — 1 room available',
    'Flatmate required for 3BHK in {locality}',
    'Sharing accommodation in {locality} — one vacancy',
  ],
  studio: [
    'Studio apartment for rent in {locality}, {city}',
    'Compact studio — fully self-contained, {locality}',
    'Modern studio apartment available — {locality}',
    'Studio flat ideal for singles — {locality}, {city}',
    'Well-designed studio in prime {locality}',
    'Cozy studio apartment — {locality}, {city}',
    'Studio with kitchen — {locality}',
    'Bright studio apartment available, {locality}',
    'Furnished studio for rent — {locality}',
    'Studio in residential colony — {locality}, {city}',
  ],
  '1BHK': [
    '1BHK apartment available for rent, {locality}, {city}',
    'Fully furnished 1BHK near {locality}',
    '1BHK flat for working professionals — {locality}',
    'Spacious 1BHK in good society, {locality}',
    '1BHK with balcony and parking — {locality}, {city}',
    'Modern 1BHK apartment available in {locality}',
    'Semi-furnished 1BHK — {locality}, {city}',
    '1BHK with all amenities, {locality}',
    'Newly renovated 1BHK in {locality}',
    '1BHK flat, easy access to main road — {locality}',
  ],
  '2BHK': [
    '2BHK flat available for rent in {locality}, {city}',
    'Spacious 2BHK with parking — {locality}',
    'Well-maintained 2BHK in gated society — {locality}',
    'Furnished 2BHK apartment — {locality}, {city}',
    '2BHK with modular kitchen and balcony — {locality}',
    '2BHK flat near metro/bus — {locality}, {city}',
    'Large 2BHK for family or professionals — {locality}',
    '2BHK in quiet residential area, {locality}',
    'Affordable 2BHK available — {locality}, {city}',
    '2BHK with power backup and security — {locality}',
  ],
  '3BHK': [
    '3BHK flat for rent in {locality}, {city}',
    'Spacious 3BHK in gated colony — {locality}',
    '3BHK with 3 bathrooms available — {locality}',
    'Large 3BHK for family / group — {locality}, {city}',
    'Fully furnished 3BHK — {locality}',
    '3BHK in prime {locality} location',
    'Newly painted 3BHK available — {locality}, {city}',
    '3BHK with garden and parking — {locality}',
    'Society 3BHK with all amenities — {locality}',
    'Spacious 3BHK flat near schools — {locality}',
  ],
};

/** Description templates for listings */
export const LISTING_DESC_TEMPLATES = [
  'This is a {furnished} {listingType} located in {locality}, {city}. It is available from {availableFrom} at a monthly rent of ₹{rent}. The property comes with {amenityCount} amenities including essential utilities. Ideal for {genderPref} looking for a comfortable and safe living space. Deposit: ₹{deposit}.',
  'Well-maintained {listingType} in {locality}. Monthly rent ₹{rent} with a deposit of ₹{deposit}. Property is {furnished}. Preferred tenant: {genderPref}. Available from {availableFrom}. Easy access to public transport and local markets.',
  'Comfortable {furnished} accommodation in the heart of {locality}, {city}. Rent: ₹{rent}/month. Suitable for working professionals and students. Property is clean, well-lit and in a safe neighbourhood. Open to {genderPref}.',
  '{listingType} available for rent in {locality}. ₹{rent}/month, deposit ₹{deposit}. {furnished}. Available from {availableFrom}. Great connectivity to commercial areas. Preference: {genderPref}.',
  'Excellent {listingType} opportunity in {locality}, {city}! Rent: ₹{rent}. Deposit: ₹{deposit}. The property is {furnished} and has good ventilation. Preferred: {genderPref}. Ready to move in from {availableFrom}.',
  'Offering a {furnished} {listingType} in {locality} at ₹{rent}/month. Located in a peaceful residential area with good infrastructure. Suited for {genderPref}. Move in from {availableFrom}. Deposit: ₹{deposit}.',
  'Looking for a {genderPref} to rent this {furnished} {listingType} in {locality}, {city}. Monthly rent: ₹{rent}. Available from {availableFrom}. Neat and clean property with all basic amenities. Deposit: ₹{deposit}.',
];

/** Fill title/description placeholders */
export const fillTemplate = (template, data) => {
  return template
    .replace(/{city}/g, data.city || '')
    .replace(/{locality}/g, data.locality || '')
    .replace(/{gender}/g, data.genderPref === 'female' ? 'Female' : data.genderPref === 'male' ? 'Male' : 'All')
    .replace(/{genderPref}/g, data.genderPref === 'female' ? 'females' : data.genderPref === 'male' ? 'males' : 'all genders')
    .replace(/{furnished}/g, data.furnished || 'unfurnished')
    .replace(/{listingType}/g, data.listingType || 'room')
    .replace(/{rent}/g, String(data.rent || ''))
    .replace(/{deposit}/g, String(data.deposit || ''))
    .replace(/{availableFrom}/g, data.availableFrom || 'immediately')
    .replace(/{amenityCount}/g, String(data.amenityCount || 3));
};
