import { Router } from 'express';
import { getChatMessages, getMyChats } from '../controllers/chatController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

// All chat routes require authentication
router.use(protect);

router.get('/my', getMyChats);
router.get('/:chatId/messages', getChatMessages);

export default router;
