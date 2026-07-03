/**
 * seedDemoData.js
 * ───────────────────────────────────────────────────────────────
 * Populates the local MongoDB with realistic demo data:
 *   • ~10,000 tenant Users (for seeker profiles)
 *   • ~2,000  owner Users (for listings)
 *   • ~10,000 SeekerProfile documents
 *   • ~3,000  Listing documents
 *
 * Usage:
 *   node src/scripts/seedDemoData.js
 *   (or via: npm run seed:demo)
 *
 * Flags:
 *   --wipe   Removes ALL data first (including non-demo).
 *            Default: only removes documents with isDemo:true.
 * ───────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Models ───────────────────────────────────────────────────
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import SeekerProfile from '../models/SeekerProfile.js';

// ─── Data pools ────────────────────────────────────────────────
import {
  CITIES, CITY_NAMES, pick, randInt, roundTo, pickCityLocality, pickPreferredAreas, pickBudget
} from './seedData/cities.js';
import { generateName, generateEmail, generatePhone } from './seedData/names.js';
import { ROOM_SEEKER_BIOS, ROOMMATE_SEEKER_BIOS, fillBio } from './seedData/bios.js';
import {
  pickAmenities, LISTING_TITLE_TEMPLATES, LISTING_DESC_TEMPLATES, fillTemplate
} from './seedData/amenities.js';
import { FEMALE_PROFILES, MALE_PROFILES, PROPERTIES } from './seedData/images.js';

// ─── Constants ─────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roommatch-ai';

const DEMO_PASSWORD_HASH = await bcrypt.hash('Demo@12345', 10);

// Target counts
const TENANT_USER_COUNT   = 10000;
const OWNER_USER_COUNT    = 2000;
const ROOM_SEEKER_COUNT   = 5500;
const ROOMMATE_SEEKER_COUNT = 4500;
const LISTING_COUNT       = 3000;

// Occupation distribution
const OCCUPATIONS = [
  'student', 'student', 'student',
  'working professional', 'working professional', 'working professional', 'working professional',
  'intern', 'intern',
  'UPSC aspirant', 'UPSC aspirant',
  'MBA student', 'MBA student',
  'freelancer',
  'startup employee', 'startup employee',
  'engineer', 'engineer',
  'designer',
  'teacher',
  'nurse',
  'banker',
  'sales employee', 'sales employee',
  'doctor',
  'lawyer',
  'other',
];

// Gender distribution (weighted)
const GENDER_POOL = [
  'male', 'male', 'male', 'male', 'male', 'male',    // ~55%
  'female', 'female', 'female', 'female', 'female',   // ~45%
];

// lookingForGender distribution
const LOOKING_FOR_GENDER_COMBOS = {
  male: [
    { val: 'male',   weight: 28 },
    { val: 'female', weight: 15 },
    { val: 'any',    weight: 15 },
  ],
  female: [
    { val: 'female', weight: 28 },
    { val: 'male',   weight: 14 },
    { val: 'any',    weight: 15 },
  ],
};

const ROOM_TYPES_SEEKER = ['1RK', '1BHK', '2BHK', 'PG', 'Studio', 'any'];
const FOOD_PREFS = ['veg', 'veg', 'non-veg', 'any'];
const FURNISHED_OPTIONS = ['unfurnished', 'semi-furnished', 'fully-furnished'];
const LISTING_ROOM_TYPES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'PG', 'Studio'];
const LISTING_TYPES_LIST = ['room', 'pg', 'shared-flat', 'studio', '1BHK', '2BHK', '3BHK'];
const GENDER_PREFS = ['male', 'male', 'female', 'female', 'any', 'any', 'any'];

// ─── Helpers ────────────────────────────────────────────────────

/** Weighted random pick from [{val, weight}] array */
const weightedPick = (opts) => {
  const total = opts.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const opt of opts) {
    r -= opt.weight;
    if (r <= 0) return opt.val;
  }
  return opts[opts.length - 1].val;
};

/** Get a random date between today and N days in the future */
const futureDate = (minDays = 0, maxDays = 120) => {
  const d = new Date();
  d.setDate(d.getDate() + randInt(minDays, maxDays));
  return d;
};

/** Format date as "DD MMM YYYY" string for listing descriptions */
const formatDate = (d) =>
  d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Generators ─────────────────────────────────────────────────

function generateTenantUser(index) {
  const gender = pick(GENDER_POOL);
  const name = generateName(gender, pick);
  const email = generateEmail(name, index);
  const profilePic = gender === 'female' ? pick(FEMALE_PROFILES) : pick(MALE_PROFILES);
  return {
    name,
    email,
    password: DEMO_PASSWORD_HASH,
    phone: generatePhone(index),
    role: 'tenant',
    profilePic,
    isVerified: true,
    otpVerified: true,
  };
}

function generateOwnerUser(index) {
  const gender = pick(GENDER_POOL);
  const name = generateName(gender, pick);
  const base = 10000 + TENANT_USER_COUNT + index;
  const email = generateEmail(name, base);
  const profilePic = gender === 'female' ? pick(FEMALE_PROFILES) : pick(MALE_PROFILES);
  return {
    name,
    email,
    password: DEMO_PASSWORD_HASH,
    phone: generatePhone(base),
    role: 'owner',
    profilePic,
    isVerified: true,
    otpVerified: true,
  };
}

function generateSeekerProfile(userId, searchingFor, index, user) {
  // Determine gender from profilePic pool
  const gender = FEMALE_PROFILES.includes(user.profilePic) ? 'female' : 'male';
  const name = user.name;
  const profilePic = user.profilePic;
  const occupation = pick(OCCUPATIONS);
  const { city, locality } = pickCityLocality();
  const budget = pickBudget(city, occupation);
  const preferredAreas = pickPreferredAreas(city, randInt(1, 3));

  const lookingForOpts = LOOKING_FOR_GENDER_COMBOS[gender] || LOOKING_FOR_GENDER_COMBOS.male;
  const lookingForGender = weightedPick(lookingForOpts);

  const bioTemplates = searchingFor === 'room' ? ROOM_SEEKER_BIOS : ROOMMATE_SEEKER_BIOS;
  const bioTemplate = pick(bioTemplates);
  const bio = fillBio(bioTemplate, { city, locality, budget, occupation, lookingForGender });

  const age = occupation === 'student' || occupation === 'UPSC aspirant'
    ? randInt(18, 26)
    : occupation === 'intern' || occupation === 'MBA student'
    ? randInt(20, 28)
    : randInt(23, 45);

  return {
    userId,
    name,
    gender,
    age,
    occupation,
    searchingFor,
    city,
    locality,
    preferredAreas,
    budget,
    moveInDate: Math.random() > 0.2 ? futureDate(3, 90) : null,
    lookingForGender,
    roomTypePreference: pick(ROOM_TYPES_SEEKER),
    foodPreference: pick(FOOD_PREFS),
    smoking: Math.random() < 0.15,
    drinking: Math.random() < 0.20,
    pets: Math.random() < 0.08,
    bio,
    profilePic,
    isDemo: true,
    isActive: true,
  };
}

function generateListing(ownerId, index) {
  const { city, locality } = pickCityLocality();
  const cityData = CITIES[city];
  const listingType = pick(LISTING_TYPES_LIST);
  const genderPreference = pick(GENDER_PREFS);
  const furnished = pick(FURNISHED_OPTIONS);
  const image = pick(PROPERTIES);

  // Realistic rent based on city, listing type
  let [rentMin, rentMax] = [cityData.budgetRange[0], cityData.ownerBudgetMax];
  if (listingType === '3BHK' || listingType === '2BHK') {
    rentMin = Math.round(rentMin * 1.5);
    rentMax = Math.round(rentMax * 1.4);
  } else if (listingType === 'pg') {
    rentMax = Math.round(rentMax * 0.7);
  } else if (listingType === 'studio') {
    rentMin = Math.round(rentMin * 1.1);
    rentMax = Math.round(rentMax * 0.9);
  }
  const rent = roundTo(randInt(rentMin, Math.min(rentMax, cityData.ownerBudgetMax)), 500);
  const deposit = roundTo(rent * randInt(1, 3), 500);

  // Room type (schema enum)
  const roomTypeMap = {
    room: pick(['1RK', '1BHK']),
    pg: 'PG',
    'shared-flat': pick(['2BHK', '3BHK']),
    studio: 'Studio',
    '1BHK': '1BHK',
    '2BHK': '2BHK',
    '3BHK': '3BHK',
  };
  const roomType = roomTypeMap[listingType] || '1BHK';

  const amenities = pickAmenities(pick, randInt, furnished);
  const availableDate = futureDate(0, 60);
  const availableFromStr = formatDate(availableDate);

  // Title
  const titleTemplates = LISTING_TITLE_TEMPLATES[listingType] || LISTING_TITLE_TEMPLATES['room'];
  const titleTemplate = pick(titleTemplates);
  const title = fillTemplate(titleTemplate, { city, locality, genderPref: genderPreference });

  // Description
  const descTemplate = pick(LISTING_DESC_TEMPLATES);
  const description = fillTemplate(descTemplate, {
    city, locality,
    genderPref: genderPreference,
    furnished,
    listingType,
    rent,
    deposit,
    availableFrom: availableFromStr,
    amenityCount: amenities.length,
  });

  return {
    ownerId,
    title,
    description,
    city,
    locality,
    address: `Near ${pick(['main road', 'metro station', 'bus stand', 'market', 'park', 'school'])}, ${locality}, ${city}`,
    rent,
    deposit,
    availableFrom: availableDate,
    roomType,
    furnished,
    genderPreference,
    amenities,
    images: [image],
    status: 'active',
    listingType,
    isDemo: true,
  };
}

// ─── Main ────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 RentFlatemate Demo Data Seeder');
  console.log('══════════════════════════════════════');
  console.log(`📡 Connecting to: ${MONGO_URI}\n`);

  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('✅ Connected to MongoDB\n');

  // ── Step 1: Clear existing demo data ──────────────────────────
  console.log('🧹 Clearing existing demo data...');
  const [dU, dL, dS] = await Promise.all([
    User.deleteMany({ email: { $regex: /\.\d{4,5}@/ } }),   // demo emails have index suffix
    Listing.deleteMany({ isDemo: true }),
    SeekerProfile.deleteMany({ isDemo: true }),
  ]);
  console.log(`   Removed ${dU.deletedCount} users, ${dL.deletedCount} listings, ${dS.deletedCount} seeker profiles\n`);

  // ── Step 2: Tenant users ───────────────────────────────────────
  console.log(`👤 Generating ${TENANT_USER_COUNT} tenant users...`);
  const tenantUserDocs = [];
  for (let i = 0; i < TENANT_USER_COUNT; i++) {
    tenantUserDocs.push(generateTenantUser(i));
  }

  // Bulk insert in batches of 1000
  const tenantUsers = [];
  const BATCH = 1000;
  for (let b = 0; b < tenantUserDocs.length; b += BATCH) {
    const batch = tenantUserDocs.slice(b, b + BATCH);
    const inserted = await User.insertMany(batch, { ordered: false }).catch(() => {
      // silently skip duplicate emails
      return [];
    });
    tenantUsers.push(...inserted);
    process.stdout.write(`   Inserted ${Math.min(b + BATCH, TENANT_USER_COUNT)} / ${TENANT_USER_COUNT}\r`);
  }
  console.log(`\n✅ ${tenantUsers.length} tenant users created\n`);

  // ── Step 3: Owner users ────────────────────────────────────────
  console.log(`🏠 Generating ${OWNER_USER_COUNT} owner users...`);
  const ownerUserDocs = [];
  for (let i = 0; i < OWNER_USER_COUNT; i++) {
    ownerUserDocs.push(generateOwnerUser(i));
  }
  const ownerUsers = [];
  for (let b = 0; b < ownerUserDocs.length; b += BATCH) {
    const batch = ownerUserDocs.slice(b, b + BATCH);
    const inserted = await User.insertMany(batch, { ordered: false }).catch(() => []);
    ownerUsers.push(...inserted);
    process.stdout.write(`   Inserted ${Math.min(b + BATCH, OWNER_USER_COUNT)} / ${OWNER_USER_COUNT}\r`);
  }
  console.log(`\n✅ ${ownerUsers.length} owner users created\n`);

  if (tenantUsers.length === 0) {
    console.error('❌ No tenant users were inserted (possible duplicate emails). Aborting.');
    process.exit(1);
  }
  if (ownerUsers.length === 0) {
    console.error('❌ No owner users were inserted. Aborting.');
    process.exit(1);
  }

  // ── Step 4: SeekerProfiles — Room Seekers ─────────────────────
  console.log(`🔍 Generating ${ROOM_SEEKER_COUNT} room-seeker profiles...`);
  const roomSeekerDocs = [];
  for (let i = 0; i < ROOM_SEEKER_COUNT; i++) {
    const user = tenantUsers[i % tenantUsers.length];
    roomSeekerDocs.push(generateSeekerProfile(user._id, 'room', i, user));
  }
  for (let b = 0; b < roomSeekerDocs.length; b += BATCH) {
    await SeekerProfile.insertMany(roomSeekerDocs.slice(b, b + BATCH), { ordered: false });
    process.stdout.write(`   Inserted ${Math.min(b + BATCH, ROOM_SEEKER_COUNT)} / ${ROOM_SEEKER_COUNT}\r`);
  }
  console.log(`\n✅ ${ROOM_SEEKER_COUNT} room-seeker profiles created\n`);

  // ── Step 5: SeekerProfiles — Roommate Seekers ─────────────────
  console.log(`🤝 Generating ${ROOMMATE_SEEKER_COUNT} roommate-seeker profiles...`);
  const roommateDocsArr = [];
  for (let i = 0; i < ROOMMATE_SEEKER_COUNT; i++) {
    const user = tenantUsers[(ROOM_SEEKER_COUNT + i) % tenantUsers.length];
    roommateDocsArr.push(generateSeekerProfile(user._id, 'roommate', ROOM_SEEKER_COUNT + i, user));
  }
  for (let b = 0; b < roommateDocsArr.length; b += BATCH) {
    await SeekerProfile.insertMany(roommateDocsArr.slice(b, b + BATCH), { ordered: false });
    process.stdout.write(`   Inserted ${Math.min(b + BATCH, ROOMMATE_SEEKER_COUNT)} / ${ROOMMATE_SEEKER_COUNT}\r`);
  }
  console.log(`\n✅ ${ROOMMATE_SEEKER_COUNT} roommate-seeker profiles created\n`);

  // ── Step 6: Listings ───────────────────────────────────────────
  console.log(`🏘️  Generating ${LISTING_COUNT} owner listings...`);
  const listingDocs = [];
  for (let i = 0; i < LISTING_COUNT; i++) {
    const owner = ownerUsers[i % ownerUsers.length];
    listingDocs.push(generateListing(owner._id, i));
  }
  let totalListings = 0;
  for (let b = 0; b < listingDocs.length; b += BATCH) {
    const inserted = await Listing.insertMany(listingDocs.slice(b, b + BATCH), { ordered: false }).catch(e => {
      console.warn('  ⚠️  Batch insert warning:', e.message.slice(0, 80));
      return [];
    });
    totalListings += inserted.length;
    process.stdout.write(`   Inserted ${Math.min(b + BATCH, LISTING_COUNT)} / ${LISTING_COUNT}\r`);
  }
  console.log(`\n✅ ${totalListings} listings created\n`);

  // ── Step 7: Summary ────────────────────────────────────────────
  const [uCount, lCount, sCount] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments({ status: 'active' }),
    SeekerProfile.countDocuments({ isActive: true }),
  ]);

  console.log('══════════════════════════════════════');
  console.log('🎉 Seeding complete! Database summary:');
  console.log(`   👤 Total Users:            ${uCount}`);
  console.log(`   🔍 Total Seeker Profiles:  ${sCount}`);
  console.log(`   🏘️   Active Listings:        ${lCount}`);
  console.log('══════════════════════════════════════');

  // City breakdown
  const cityBreakdown = await Listing.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  console.log('\n📍 Listings by city:');
  cityBreakdown.forEach(({ _id, count }) => {
    console.log(`   ${(_id || 'Unknown').padEnd(15)} ${count}`);
  });

  const seekerCityBreakdown = await SeekerProfile.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  console.log('\n📍 Top 10 cities by seeker profiles:');
  seekerCityBreakdown.forEach(({ _id, count }) => {
    console.log(`   ${(_id || 'Unknown').padEnd(15)} ${count}`);
  });

  console.log('\n✅ Done! Run your server and browse the data.\n');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('\n❌ Seeding failed:', err.message);
  mongoose.disconnect().finally(() => process.exit(1));
});
