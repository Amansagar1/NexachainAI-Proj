const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

let mongod = null;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    // Try connecting to configured MONGODB_URI with a 4s timeout
    logger.info(`Attempting to connect to MongoDB at ${env.MONGODB_URI}...`);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    logger.info('MongoDB connected successfully via MONGODB_URI');
  } catch (err) {
    if (env.NODE_ENV !== 'production') {
      logger.warn('Direct MongoDB connection failed. Initializing in-memory Mongo server for development/demo fallback...', {
        error: err.message,
      });

      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        logger.info(`Connected to in-memory MongoDB at ${uri}`);
      } catch (memErr) {
        logger.error('Failed to start in-memory MongoDB fallback', memErr);
        throw err;
      }
    } else {
      logger.error('MongoDB connection error in production', err);
      process.exit(1);
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
