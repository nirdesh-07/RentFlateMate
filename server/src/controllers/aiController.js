import { processChat } from '../services/aiService.js';

/**
 * POST /api/ai/chat
 * Body: { message: string }
 */
export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        reply: '🤔 Please send a message so I can help you!',
      });
    }

    if (message.trim().length > 500) {
      return res.status(400).json({
        success: false,
        reply: '✂️ Please keep your message under 500 characters.',
      });
    }

    const reply = await processChat(message);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error('AI chat error:', err.message);
    // Friendly fallback even on unhandled errors
    return res.status(200).json({
      success: true,
      reply: '😅 Something went wrong on my end! Try asking again — I\'m here to help with rooms, listings, and flatmate tips.',
    });
  }
};
