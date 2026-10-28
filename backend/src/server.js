const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/database');
const { initRoiScheduler } = require('./jobs/roiScheduler');
const logger = require('./utils/logger');
const User = require('./models/User');
const Investment = require('./models/Investment');
const { INVESTMENT_PLANS, INVESTMENT_STATUS } = require('./constants/businessRules');

/**
 * Optional seed helper to ensure reviewers have demo data matching the UI designs
 */
const seedDemoData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      logger.info('Database empty. Seeding initial demo data for evaluation...');

      // 1. Root user: John Doe
      const john = await User.create({
        fullName: 'John Doe',
        email: 'john@nexachain.ai',
        mobileNumber: '+919876543210',
        password: 'password123',
        referralCode: 'NXA123456',
        walletBalance: 12750,
        totalRoiEarned: 12750,
        totalLevelIncomeEarned: 4500,
        accountStatus: 'Active',
      });

      // 2. Direct referrals (Level 1)
      const u123 = await User.create({
        fullName: 'User 123',
        email: 'user123@nexachain.ai',
        mobileNumber: '+919876543211',
        password: 'password123',
        referralCode: 'NXA888123',
        referredBy: john._id,
        walletBalance: 1800,
        totalRoiEarned: 1200,
        totalLevelIncomeEarned: 600,
        accountStatus: 'Active',
      });

      const u456 = await User.create({
        fullName: 'User 456',
        email: 'user456@nexachain.ai',
        mobileNumber: '+919876543212',
        password: 'password123',
        referralCode: 'NXA888456',
        referredBy: john._id,
        walletBalance: 1200,
        totalRoiEarned: 1000,
        totalLevelIncomeEarned: 200,
        accountStatus: 'Active',
      });

      const u789 = await User.create({
        fullName: 'User 789',
        email: 'user789@nexachain.ai',
        mobileNumber: '+919876543213',
        password: 'password123',
        referralCode: 'NXA888789',
        referredBy: john._id,
        walletBalance: 1000,
        totalRoiEarned: 1000,
        totalLevelIncomeEarned: 0,
        accountStatus: 'Active',
      });

      const u321 = await User.create({
        fullName: 'User 321',
        email: 'user321@nexachain.ai',
        mobileNumber: '+919876543214',
        password: 'password123',
        referralCode: 'NXA888321',
        referredBy: john._id,
        walletBalance: 1500,
        totalRoiEarned: 1200,
        totalLevelIncomeEarned: 300,
        accountStatus: 'Active',
      });

      // 3. Level 2 referrals (under u123)
      const u654 = await User.create({
        fullName: 'User 654',
        email: 'user654@nexachain.ai',
        mobileNumber: '+919876543215',
        password: 'password123',
        referralCode: 'NXA999654',
        referredBy: u123._id,
        walletBalance: 500,
        totalRoiEarned: 500,
        totalLevelIncomeEarned: 0,
        accountStatus: 'Active',
      });

      const u987 = await User.create({
        fullName: 'User 987',
        email: 'user987@nexachain.ai',
        mobileNumber: '+919876543216',
        password: 'password123',
        referralCode: 'NXA999987',
        referredBy: u123._id,
        walletBalance: 750,
        totalRoiEarned: 750,
        totalLevelIncomeEarned: 0,
        accountStatus: 'Active',
      });

      // 4. Level 3 referrals (under u654)
      await User.create({
        fullName: 'User 777',
        email: 'user777@nexachain.ai',
        mobileNumber: '+919876543217',
        password: 'password123',
        referralCode: 'NXA777001',
        referredBy: u654._id,
        walletBalance: 0,
        accountStatus: 'Active',
      });

      await User.create({
        fullName: 'User 888',
        email: 'user888@nexachain.ai',
        mobileNumber: '+919876543218',
        password: 'password123',
        referralCode: 'NXA888002',
        referredBy: u654._id,
        walletBalance: 100,
        accountStatus: 'Active',
      });

      // 5. Active investments for John Doe matching UI designs
      const now = new Date();
      const planA = INVESTMENT_PLANS.GROWTH_A;
      const planB = INVESTMENT_PLANS.GROWTH_B;

      await Investment.create({
        user: john._id,
        investmentAmount: 25000,
        planDetails: {
          planId: planA.id,
          planName: planA.name,
          durationDays: planA.durationDays,
          subtitle: planA.subtitle,
          color: planA.color,
        },
        startDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 65 * 24 * 60 * 60 * 1000),
        dailyRoiPercentage: planA.dailyRoiPercentage,
        totalRoiEarned: 6250,
        investmentStatus: INVESTMENT_STATUS.ACTIVE,
      });

      await Investment.create({
        user: john._id,
        investmentAmount: 25000,
        planDetails: {
          planId: planB.id,
          planName: planB.name,
          durationDays: planB.durationDays,
          subtitle: planB.subtitle,
          color: planB.color,
        },
        startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 105 * 24 * 60 * 60 * 1000),
        dailyRoiPercentage: planB.dailyRoiPercentage,
        totalRoiEarned: 5625,
        investmentStatus: INVESTMENT_STATUS.ACTIVE,
      });

      logger.info('Demo data seeded successfully. Demo credentials: john@nexachain.ai / password123');
    }
  } catch (err) {
    logger.warn('Error during demo data seeding:', err.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();

    await seedDemoData();

    // Start ROI scheduler
    initRoiScheduler();

    const server = app.listen(env.PORT, () => {
      logger.info(`Nexachain AI Server listening on port ${env.PORT} [ENV: ${env.NODE_ENV}]`);
      logger.info(`Health check: http://localhost:${env.PORT}/api/health`);
    });

    const shutdown = () => {
      logger.info('Shutting down server gracefully...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
