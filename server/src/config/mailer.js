import nodemailer from 'nodemailer';

/**
 * Creates a nodemailer transporter using environment credentials.
 * Falls back gracefully if credentials are missing (dev mode).
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured. Mail sending will be skipped.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send an email.
 * @param {Object} options - { to, subject, html, text }
 */
export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    // Dev fallback: log the OTP to console instead of sending
    console.log(`📧 [DEV MAIL] To: ${to} | Subject: ${subject} | Body: ${text || html}`);
    return { messageId: 'dev-mode-no-email-sent' };
  }

  const info = await transporter.sendMail({
    from: `"RentFlatemate" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

/**
 * Send OTP email.
 */
export const sendOtpEmail = async ({ to, otp, purpose }) => {
  const purposeLabel = purpose === 'signup'
    ? 'verify your account'
    : purpose === 'login'
    ? 'log in to your account'
    : 'reset your password';

  return sendMail({
    to,
    subject: `Your RentFlatemate OTP - ${otp}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">RentFlatemate</h2>
        <p style="color: #475569; margin-bottom: 24px;">Use the OTP below to ${purposeLabel}. It expires in <strong>5 minutes</strong>.</p>
        <div style="background: #1e293b; color: #fff; font-size: 32px; font-weight: bold; letter-spacing: 12px; text-align: center; padding: 24px; border-radius: 8px;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
    text: `Your RentFlatemate OTP is: ${otp}. It expires in 5 minutes.`,
  });
};
