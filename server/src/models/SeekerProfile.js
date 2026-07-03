import mongoose from 'mongoose';

/**
 * SeekerProfile — stores people who are:
 *   searchingFor = "room"     → looking for a place to stay
 *   searchingFor = "roommate" → already have / want shared accommodation,
 *                               looking for someone to share with
 *
 * Both types surface as discovery cards on the platform.
 */
const seekerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ── Core identity ──────────────────────────────────
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    age: { type: Number, min: 16, max: 80, required: true },
    occupation: {
      type: String,
      enum: [
        'student',
        'working professional',
        'intern',
        'freelancer',
        'startup employee',
        'UPSC aspirant',
        'MBA student',
        'designer',
        'teacher',
        'nurse',
        'banker',
        'sales employee',
        'engineer',
        'doctor',
        'lawyer',
        'other',
      ],
      default: 'other',
    },

    // ── What they are searching for ────────────────────
    searchingFor: {
      type: String,
      enum: ['room', 'roommate'],
      required: true,
    },

    // ── Location preferences ───────────────────────────
    city: { type: String, required: true, trim: true },
    locality: { type: String, trim: true, default: '' },
    preferredAreas: { type: [String], default: [] },

    // ── Budget & timing ────────────────────────────────
    budget: { type: Number, required: true, min: 0 },
    moveInDate: { type: Date, default: null },

    // ── Compatibility filters ──────────────────────────
    lookingForGender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any',
    },
    roomTypePreference: {
      type: String,
      enum: ['1RK', '1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'any'],
      default: 'any',
    },

    // ── Lifestyle ──────────────────────────────────────
    foodPreference: {
      type: String,
      enum: ['veg', 'non-veg', 'any'],
      default: 'any',
    },
    smoking: { type: Boolean, default: false },
    drinking: { type: Boolean, default: false },
    pets: { type: Boolean, default: false },

    // ── Profile ────────────────────────────────────────
    bio: { type: String, trim: true, default: '' },
    profilePic: { type: String, default: null },

    // ── Meta ───────────────────────────────────────────
    isDemo: { type: Boolean, default: false }, // marks seed data for easy cleanup
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for common filter queries
seekerProfileSchema.index({ city: 1, searchingFor: 1 });
seekerProfileSchema.index({ lookingForGender: 1 });
seekerProfileSchema.index({ budget: 1 });
seekerProfileSchema.index({ isDemo: 1 });

const SeekerProfile = mongoose.model('SeekerProfile', seekerProfileSchema);
export default SeekerProfile;
