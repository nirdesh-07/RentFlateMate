import crypto from 'crypto';

/**
 * Generate a cryptographically secure 6-digit OTP.
 * @returns {string} 6-digit numeric string
 */
const generateOtp = () => {
  // Use crypto for secure randomness
  const randomBytes = crypto.randomBytes(3); // 3 bytes = 0-16777215
  const num = randomBytes.readUIntBE(0, 3) % 1000000;
  return String(num).padStart(6, '0');
};

export default generateOtp;
