import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/talent_hub';
    
    // Allow disabling autoIndex during seeding to avoid index build errors
    const disableIndexes = process.env.DISABLE_INDEXES === 'true';
    if (disableIndexes) {
      mongoose.set('autoIndex', false);
    }

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
      // the following options are no-ops on modern drivers but kept for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: !disableIndexes,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('⚠️  MongoDB is not running. Please start MongoDB or use MongoDB Atlas');
    console.error('💡 For local development, install and start MongoDB');
    console.error('💡 For production, update MONGODB_URI in .env file with your MongoDB Atlas connection string');
    
    // Don't exit the process, let the server start without database
    console.log('🚀 Server will start without database connection');
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

export default connectDB;
