import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

/**
 * GET /api/chat/:chatId/messages
 * Retrieve all messages for a chat room. Only participants can access.
 */
export const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found.',
      });
    }

    // Verify user is a participant
    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat.',
      });
    }

    const messages = await Message.find({ chatId })
      .populate('sender', 'name email profilePic')
      .sort({ createdAt: 1 }); // oldest first

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/chat/my
 * Get all chats the logged-in user is a participant in.
 */
export const getMyChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name email profilePic')
      .populate('listingId', 'title city locality rent')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (err) {
    next(err);
  }
};
