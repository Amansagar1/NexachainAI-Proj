const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

let mongod = null;

// ------------------------------ Connect Database (Supports Serverless Reuse) ------------------------------
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    mongoose.set('strictQuery', false);
    logger.info(`Attempting to connect to MongoDB at ${env.MONGODB_URI}...`);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('MongoDB connected successfully via MONGODB_URI');
    return mongoose.connection;
  } catch (err) {
    if (env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      logger.warn('Direct MongoDB connection failed. Initializing in-memory Mongo server for development/demo fallback...', {
        error: err.message,
      });

      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        logger.info(`Connected to in-memory MongoDB at ${uri}`);
        return mongoose.connection;
      } catch (memErr) {
        logger.error('Failed to start in-memory MongoDB fallback', memErr);
        throw err;
      }
    } else {
      logger.error('MongoDB connection error in production', err);
      throw err;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
