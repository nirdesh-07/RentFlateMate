import { Server } from 'socket.io';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a specific chat room by chatId
    socket.on('join_chat', async ({ chatId, userId }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat room not found' });
          return;
        }

        const isParticipant = chat.participants.some(
          (p) => p.toString() === userId
        );
        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to join this chat' });
          return;
        }

        socket.join(chatId);
        console.log(`👤 User ${userId} joined chat ${chatId}`);
        socket.emit('joined_chat', { chatId });
      } catch (err) {
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Handle sending a message
    socket.on('send_message', async ({ chatId, senderId, text }) => {
      try {
        if (!chatId || !senderId || !text?.trim()) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        const isParticipant = chat.participants.some(
          (p) => p.toString() === senderId
        );
        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to send messages in this chat' });
          return;
        }

        // Persist message to DB
        const message = await Message.create({
          chatId,
          sender: senderId,
          text: text.trim(),
        });

        const populated = await message.populate('sender', 'name email profilePic');

        // Broadcast to all in that chat room including sender
        io.to(chatId).emit('receive_message', populated);

        // Update chat updatedAt
        await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
      } catch (err) {
        console.error('send_message error:', err.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};
