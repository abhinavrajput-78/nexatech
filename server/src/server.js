const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(config.PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 NexaTech Enterprise API running on port ${config.PORT}`);
    console.log(`📡 Environment: ${config.NODE_ENV}`);
    console.log(`🔗 Health Check: http://localhost:${config.PORT}/api/health`);
    console.log(`💻 Client Allowed Origin: ${config.CLIENT_URL}`);
    console.log(`===============================================`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
