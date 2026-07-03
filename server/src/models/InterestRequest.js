import mongoose from 'mongoose';

const interestRequestSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    compatibilityScore: {
      type: Number,
      default: null,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// One tenant can only have one active interest per listing
interestRequestSchema.index({ tenantId: 1, listingId: 1 }, { unique: true });

const InterestRequest = mongoose.model('InterestRequest', interestRequestSchema);
export default InterestRequest;
