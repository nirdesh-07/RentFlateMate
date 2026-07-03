import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import compatibilityRoutes from './routes/compatibilityRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import seekerRoutes from './routes/seekerRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

// Security headers
app.use(helmet());

// CORS — allow only the frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', globalLimiter);

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many auth attempts, please try again in 15 minutes.',
  },
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'RentFlatemate server is running.' });
});

// Mount routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/otp', authLimiter, otpRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/compatibility', compatibilityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/seekers', seekerRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: [${req.method}] ${req.originalUrl}`,
  });
});

// Centralized error handler — must be last
app.use(errorHandler);

export default app;
