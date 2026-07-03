import mongoose from 'mongoose';

const compatibilitySchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    explanation: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['ai', 'fallback'],
      default: 'fallback',
    },
  },
  { timestamps: true }
);

// One score per tenant-listing pair
compatibilitySchema.index({ tenantId: 1, listingId: 1 }, { unique: true });

const Compatibility = mongoose.model('Compatibility', compatibilitySchema);
export default Compatibility;
