import Otp from '../models/Otp.js';
import User from '../models/User.js';
import generateOtp from '../utils/generateOtp.js';
import { sendOtpEmail } from '../config/mailer.js';

const OTP_EXPIRY_MINUTES = 5;

/**
 * POST /api/otp/send
 * Generate and send an OTP to a given email.
 */
export const sendOtp = async (req, res, next) => {
  try {
    const { email, purpose = 'signup' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    // Find the user for optional linking
    const user = await User.findOne({ email: email.toLowerCase() });

    // Delete any existing OTP for this target + purpose
    await Otp.deleteMany({ target: email.toLowerCase(), purpose });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.create({
      target: email.toLowerCase(),
      userId: user?._id || null,
      otp,
      purpose,
      expiresAt,
    });

    // Send email (gracefully skipped if credentials not set)
    await sendOtpEmail({ to: email, otp, purpose });

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${email}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      // Only return OTP in development for easier testing
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/otp/verify
 * Verify OTP and mark user as verified.
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, purpose = 'signup' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required.',
      });
    }

    const otpRecord = await Otp.findOne({
      target: email.toLowerCase(),
      purpose,
      verified: false,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or already used. Please request a new one.',
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.deleteOne();
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    if (otpRecord.otp !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.',
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // If there's a linked user, mark them as verified
    if (otpRecord.userId) {
      await User.findByIdAndUpdate(otpRecord.userId, {
        isVerified: true,
        otpVerified: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (err) {
    next(err);
  }
};
