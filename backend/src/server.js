import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js'; // adjust path if needed

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB only if not in CI
if (process.env.CI !== 'true') {
  connectDB().catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // optional: fail if DB is required
  });
} else {
  console.log('CI detected, skipping database connection');
}

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('Process terminated');
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
