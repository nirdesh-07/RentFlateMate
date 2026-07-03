import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './config/socket.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB before starting the server
  await connectDB();

  // Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // Initialize Socket.IO on the same HTTP server
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`\n🚀 RentFlatemate server running on port ${PORT}`);
    console.log(`   API:    http://localhost:${PORT}/api`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Frontend origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
    httpServer.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
