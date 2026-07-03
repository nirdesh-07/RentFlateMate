import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    rent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [0, 'Rent must be a positive number'],
    },
    deposit: {
      type: Number,
      default: 0,
      min: [0, 'Deposit must be a positive number'],
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    roomType: {
      type: String,
      enum: ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'PG', 'Studio', 'Independent House'],
      required: [true, 'Room type is required'],
    },
    furnished: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished',
    },
    genderPreference: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'filled', 'inactive'],
      default: 'active',
    },
    listingType: {
      type: String,
      enum: ['room', 'pg', 'shared-flat', 'studio', '1BHK', '2BHK', '3BHK'],
      default: 'room',
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for common filter queries
listingSchema.index({ city: 1, status: 1 });
listingSchema.index({ rent: 1 });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
