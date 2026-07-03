import { Router } from 'express';
import { chat } from '../controllers/aiController.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Chatbot-specific rate limit: 30 messages per 5 minutes
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    reply: '⏳ You\'re sending messages too fast! Please wait a moment before asking again.',
  },
});

router.post('/chat', chatLimiter, chat);

export default router;
