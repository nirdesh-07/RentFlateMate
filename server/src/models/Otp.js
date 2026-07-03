import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    // Target: email or phone where OTP was sent
    target: {
      type: String,
      required: [true, 'OTP target (email or phone) is required'],
      trim: true,
    },
    // Optional link to a user if they already exist
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['signup', 'login', 'reset'],
      default: 'signup',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-delete expired OTP documents via TTL index
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
