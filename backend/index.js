// ------------------------------ Express Application Entry Point ------------------------------
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

// Ensure database connection is initialized for serverless environments
connectDB().catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;

