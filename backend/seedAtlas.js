const mongoose = require('mongoose');
const env = require('./src/config/env');
const User = require('./src/models/User');
const Investment = require('./src/models/Investment');
const ROIHistory = require('./src/models/ROIHistory');
const ReferralIncome = require('./src/models/ReferralIncome');
const WalletTransaction = require('./src/models/WalletTransaction');
const { INVESTMENT_PLANS, INVESTMENT_STATUS, ROI_STATUS, REFERRAL_INCOME_TYPE } = require('./src/constants/businessRules');

const seedAtlas = async () => {
  try {
    console.log('Connecting to MongoDB Atlas database naxachain...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to Atlas successfully!');

    // Clear existing collections in naxachain
    console.log('Clearing existing collections in naxachain...');
    await Promise.all([
      User.deleteMany({}),
      Investment.deleteMany({}),
      ROIHistory.deleteMany({}),
      ReferralIncome.deleteMany({}),
      WalletTransaction.deleteMany({}),
    ]);

    console.log('Seeding demo users into naxachain...');

    // 1. Root user: John Doe
    const john = await User.create({
      fullName: 'John Doe',
      email: 'john@nexachain.ai',
      mobileNumber: '+91 98765 43210',
      password: 'password123',
      referralCode: 'NXA123456',
      walletBalance: 12750,
      totalRoiEarned: 12750,
      totalLevelIncomeEarned: 4500,
      accountStatus: 'Active',
      city: 'New Delhi',
      country: 'India',
      address: 'Suite 402, Barakhamba Road, Connaught Place',
      dateOfBirth: '1992-05-18',
      gender: 'Male',
    });

    // 2. Direct referrals (Level 1)
    const u123 = await User.create({
      fullName: 'user123',
      email: 'user123@nexachain.ai',
      mobileNumber: '+919876543211',
      password: 'password123',
      referralCode: 'NXA888123',
      referredBy: john._id,
      walletBalance: 1800,
      totalRoiEarned: 1800,
      totalLevelIncomeEarned: 600,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-30'),
    });

    const u456 = await User.create({
      fullName: 'user456',
      email: 'user456@nexachain.ai',
      mobileNumber: '+919876543212',
      password: 'password123',
      referralCode: 'NXA888456',
      referredBy: john._id,
      walletBalance: 1200,
      totalRoiEarned: 1200,
      totalLevelIncomeEarned: 200,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-28'),
    });

    const u789 = await User.create({
      fullName: 'user789',
      email: 'user789@nexachain.ai',
      mobileNumber: '+919876543213',
      password: 'password123',
      referralCode: 'NXA888789',
      referredBy: john._id,
      walletBalance: 1000,
      totalRoiEarned: 1000,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-25'),
    });

    const u321 = await User.create({
      fullName: 'user321',
      email: 'user321@nexachain.ai',
      mobileNumber: '+919876543214',
      password: 'password123',
      referralCode: 'NXA888321',
      referredBy: john._id,
      walletBalance: 1500,
      totalRoiEarned: 1500,
      totalLevelIncomeEarned: 300,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-22'),
    });

    const u654 = await User.create({
      fullName: 'user654',
      email: 'user654@nexachain.ai',
      mobileNumber: '+919876543215',
      password: 'password123',
      referralCode: 'NXA999654',
      referredBy: john._id,
      walletBalance: 500,
      totalRoiEarned: 500,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-20'),
    });

    // 3. Level 2 referrals (under user123)
    const u987 = await User.create({
      fullName: 'user987',
      email: 'user987@nexachain.ai',
      mobileNumber: '+919876543216',
      password: 'password123',
      referralCode: 'NXA999987',
      referredBy: u123._id,
      walletBalance: 750,
      totalRoiEarned: 750,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-21'),
    });

    const u111 = await User.create({
      fullName: 'user111',
      email: 'user111@nexachain.ai',
      mobileNumber: '+919876543217',
      password: 'password123',
      referralCode: 'NXA999111',
      referredBy: u123._id,
      walletBalance: 250,
      totalRoiEarned: 250,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-18'),
    });

    const u222 = await User.create({
      fullName: 'user222',
      email: 'user222@nexachain.ai',
      mobileNumber: '+919876543218',
      password: 'password123',
      referralCode: 'NXA999222',
      referredBy: u456._id,
      walletBalance: 500,
      totalRoiEarned: 500,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-19'),
    });

    const u333 = await User.create({
      fullName: 'user333',
      email: 'user333@nexachain.ai',
      mobileNumber: '+919876543219',
      password: 'password123',
      referralCode: 'NXA999333',
      referredBy: u789._id,
      walletBalance: 250,
      totalRoiEarned: 250,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-17'),
    });

    const u444 = await User.create({
      fullName: 'user444',
      email: 'user444@nexachain.ai',
      mobileNumber: '+919876543220',
      password: 'password123',
      referralCode: 'NXA999444',
      referredBy: u789._id,
      walletBalance: 250,
      totalRoiEarned: 250,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-16'),
    });

    const u555 = await User.create({
      fullName: 'user555',
      email: 'user555@nexachain.ai',
      mobileNumber: '+919876543221',
      password: 'password123',
      referralCode: 'NXA999555',
      referredBy: u321._id,
      walletBalance: 500,
      totalRoiEarned: 500,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-15'),
    });

    const u666 = await User.create({
      fullName: 'user666',
      email: 'user666@nexachain.ai',
      mobileNumber: '+919876543222',
      password: 'password123',
      referralCode: 'NXA999666',
      referredBy: u321._id,
      walletBalance: 500,
      totalRoiEarned: 500,
      totalLevelIncomeEarned: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-14'),
    });

    // 4. Level 3 referrals (under u987 & u222 & u333)
    await User.create({
      fullName: 'user777',
      email: 'user777@nexachain.ai',
      mobileNumber: '+919876543223',
      password: 'password123',
      referralCode: 'NXA777001',
      referredBy: u987._id,
      walletBalance: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-12'),
    });

    await User.create({
      fullName: 'user888',
      email: 'user888@nexachain.ai',
      mobileNumber: '+919876543224',
      password: 'password123',
      referralCode: 'NXA888002',
      referredBy: u987._id,
      walletBalance: 100,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-11'),
    });

    await User.create({
      fullName: 'user999',
      email: 'user999@nexachain.ai',
      mobileNumber: '+919876543225',
      password: 'password123',
      referralCode: 'NXA999003',
      referredBy: u222._id,
      walletBalance: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-10'),
    });

    await User.create({
      fullName: 'user1000',
      email: 'user1000@nexachain.ai',
      mobileNumber: '+919876543226',
      password: 'password123',
      referralCode: 'NXA100004',
      referredBy: u222._id,
      walletBalance: 100,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-09'),
    });

    await User.create({
      fullName: 'user1010',
      email: 'user1010@nexachain.ai',
      mobileNumber: '+919876543227',
      password: 'password123',
      referralCode: 'NXA101005',
      referredBy: u333._id,
      walletBalance: 0,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-08'),
    });

    await User.create({
      fullName: 'user1111',
      email: 'user1111@nexachain.ai',
      mobileNumber: '+919876543228',
      password: 'password123',
      referralCode: 'NXA111106',
      referredBy: u333._id,
      walletBalance: 100,
      accountStatus: 'Active',
      createdAt: new Date('2024-10-07'),
    });

    // 5. Investments for John Doe (matching UI Design screenshot #2 & #3)
    console.log('Seeding investments into naxachain...');
    const inv1 = await Investment.create({
      user: john._id,
      investmentAmount: 25000,
      planDetails: {
        planId: INVESTMENT_PLANS.GROWTH_A.id,
        planName: INVESTMENT_PLANS.GROWTH_A.name,
        durationDays: 90,
        subtitle: INVESTMENT_PLANS.GROWTH_A.subtitle,
        color: INVESTMENT_PLANS.GROWTH_A.color,
      },
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-01-01'),
      dailyRoiPercentage: 1.0,
      totalRoiEarned: 2150,
      investmentStatus: INVESTMENT_STATUS.ACTIVE,
    });

    const inv2 = await Investment.create({
      user: john._id,
      investmentAmount: 25000,
      planDetails: {
        planId: INVESTMENT_PLANS.GROWTH_B.id,
        planName: INVESTMENT_PLANS.GROWTH_B.name,
        durationDays: 120,
        subtitle: INVESTMENT_PLANS.GROWTH_B.subtitle,
        color: INVESTMENT_PLANS.GROWTH_B.color,
      },
      startDate: new Date('2024-10-15'),
      endDate: new Date('2025-02-12'),
      dailyRoiPercentage: 1.5,
      totalRoiEarned: 1200,
      investmentStatus: INVESTMENT_STATUS.ACTIVE,
    });

    const inv3 = await Investment.create({
      user: john._id,
      investmentAmount: 50000,
      planDetails: {
        planId: INVESTMENT_PLANS.WEALTH.id,
        planName: INVESTMENT_PLANS.WEALTH.name,
        durationDays: 180,
        subtitle: INVESTMENT_PLANS.WEALTH.subtitle,
        color: INVESTMENT_PLANS.WEALTH.color,
      },
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-02-28'),
      dailyRoiPercentage: 2.0,
      totalRoiEarned: 28500,
      investmentStatus: INVESTMENT_STATUS.COMPLETED,
    });

    const inv4 = await Investment.create({
      user: john._id,
      investmentAmount: 10000,
      planDetails: {
        planId: INVESTMENT_PLANS.PREMIUM.id,
        planName: INVESTMENT_PLANS.PREMIUM.name,
        durationDays: 365,
        subtitle: INVESTMENT_PLANS.PREMIUM.subtitle,
        color: INVESTMENT_PLANS.PREMIUM.color,
      },
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-08-01'),
      dailyRoiPercentage: 2.5,
      totalRoiEarned: 500,
      investmentStatus: INVESTMENT_STATUS.CANCELLED,
    });

    // 6. Referral Income Records (matching UI Design screenshot #5)
    console.log('Seeding referral income records into naxachain...');
    const referralData = [
      { from: u123, level: 1, amount: 500, type: REFERRAL_INCOME_TYPE.DIRECT, date: '2024-10-30', inv: inv1 },
      { from: u456, level: 2, amount: 250, type: REFERRAL_INCOME_TYPE.LEVEL, date: '2024-10-29', inv: inv2 },
      { from: u789, level: 3, amount: 100, type: REFERRAL_INCOME_TYPE.LEVEL, date: '2024-10-28', inv: inv3 },
      { from: u321, level: 1, amount: 500, type: REFERRAL_INCOME_TYPE.DIRECT, date: '2024-10-27', inv: inv1 },
      { from: u654, level: 2, amount: 250, type: REFERRAL_INCOME_TYPE.LEVEL, date: '2024-10-26', inv: inv2 },
      { from: u987, level: 3, amount: 100, type: REFERRAL_INCOME_TYPE.LEVEL, date: '2024-10-25', inv: inv3 },
      { from: u111, level: 1, amount: 500, type: REFERRAL_INCOME_TYPE.DIRECT, date: '2024-10-24', inv: inv1 },
      { from: u222, level: 2, amount: 250, type: REFERRAL_INCOME_TYPE.LEVEL, date: '2024-10-23', inv: inv2 },
      { from: u333, level: 3, amount: 100, type: REFERRAL_INCOME_TYPE.LEVEL, date: '2024-10-22', inv: inv3 },
      { from: u444, level: 1, amount: 500, type: REFERRAL_INCOME_TYPE.DIRECT, date: '2024-10-21', inv: inv1 },
    ];

    for (const ref of referralData) {
      await ReferralIncome.create({
        user: john._id,
        fromUser: ref.from._id,
        referralLevel: ref.level,
        incomeAmount: ref.amount,
        incomeType: ref.type,
        investment: ref.inv._id,
        date: new Date(ref.date),
        status: 'Credited',
      });
    }

    // 7. ROI History Records (matching UI Design screenshot #4)
    console.log('Seeding ROI history records into naxachain...');
    const roiData = [
      { date: '2024-10-30', inv: inv1, amount: 250, pct: 1.0 },
      { date: '2024-10-29', inv: inv2, amount: 375, pct: 1.5 },
      { date: '2024-10-28', inv: inv3, amount: 1000, pct: 2.0 },
      { date: '2024-10-27', inv: inv1, amount: 250, pct: 1.0 },
      { date: '2024-10-26', inv: inv2, amount: 375, pct: 1.5 },
      { date: '2024-10-25', inv: inv3, amount: 1000, pct: 2.0 },
      { date: '2024-10-24', inv: inv1, amount: 250, pct: 1.0 },
      { date: '2024-10-23', inv: inv2, amount: 375, pct: 1.5 },
      { date: '2024-10-22', inv: inv3, amount: 1000, pct: 2.0 },
      { date: '2024-10-21', inv: inv1, amount: 250, pct: 1.0 },
    ];

    for (const roi of roiData) {
      await ROIHistory.create({
        user: john._id,
        investment: roi.inv._id,
        roiAmount: roi.amount,
        dailyRoiPercentage: roi.pct,
        date: new Date(roi.date),
        earningDateStr: roi.date,
        status: ROI_STATUS.CREDITED,
        remarks: 'Daily ROI credited successfully',
      });
    }

    // 8. Wallet Transactions (matching UI Design screenshot #6 & Wallet Page)
    console.log('Seeding wallet transactions into naxachain...');
    const walletTxns = [
      {
        transactionId: 'TXN-90218',
        type: 'ROI Payout',
        category: 'roi',
        date: new Date('2024-10-30T10:00:00Z'),
        description: 'Growth Plan B (2.0% Daily ROI)',
        amount: 400,
        isCredit: true,
        status: 'Completed',
        method: 'Automated Daily Payout',
      },
      {
        transactionId: 'TXN-90217',
        type: 'Referral Bonus',
        category: 'referral',
        date: new Date('2024-10-30T08:45:00Z'),
        description: 'Level 1 Commission from user123',
        amount: 500,
        isCredit: true,
        status: 'Completed',
        method: 'Direct Referral Bonus',
      },
      {
        transactionId: 'TXN-90216',
        type: 'Withdrawal',
        category: 'withdrawal',
        date: new Date('2024-10-29T15:20:00Z'),
        description: 'Settlement to HDFC Bank •••• 9821',
        amount: 2000,
        isCredit: false,
        status: 'Completed',
        method: 'IMPS Bank Transfer',
      },
      {
        transactionId: 'TXN-90215',
        type: 'ROI Payout',
        category: 'roi',
        date: new Date('2024-10-29T10:00:00Z'),
        description: 'Growth Plan B (2.0% Daily ROI)',
        amount: 400,
        isCredit: true,
        status: 'Completed',
        method: 'Automated Daily Payout',
      },
      {
        transactionId: 'TXN-90214',
        type: 'Referral Bonus',
        category: 'referral',
        date: new Date('2024-10-28T14:10:00Z'),
        description: 'Level 2 Commission from user654',
        amount: 250,
        isCredit: true,
        status: 'Completed',
        method: 'Level 2 Referral Bonus',
      },
      {
        transactionId: 'TXN-90213',
        type: 'ROI Payout',
        category: 'roi',
        date: new Date('2024-10-28T10:00:00Z'),
        description: 'Wealth Plan (2.5% Daily ROI)',
        amount: 625,
        isCredit: true,
        status: 'Completed',
        method: 'Automated Daily Payout',
      },
      {
        transactionId: 'TXN-90212',
        type: 'Deposit',
        category: 'deposit',
        date: new Date('2024-10-27T18:30:00Z'),
        description: 'Wallet Top-Up via UPI Instant',
        amount: 5000,
        isCredit: true,
        status: 'Completed',
        method: 'Google Pay UPI',
      },
      {
        transactionId: 'TXN-90211',
        type: 'Withdrawal',
        category: 'withdrawal',
        date: new Date('2024-10-25T11:00:00Z'),
        description: 'Settlement to HDFC Bank •••• 9821',
        amount: 1200,
        isCredit: false,
        status: 'Completed',
        method: 'IMPS Bank Transfer',
      },
      {
        transactionId: 'TXN-90210',
        type: 'Referral Bonus',
        category: 'referral',
        date: new Date('2024-10-25T09:15:00Z'),
        description: 'Level 1 Commission from user321',
        amount: 500,
        isCredit: true,
        status: 'Completed',
        method: 'Direct Referral Bonus',
      },
      {
        transactionId: 'TXN-90209',
        type: 'ROI Payout',
        category: 'roi',
        date: new Date('2024-10-24T10:00:00Z'),
        description: 'Growth Plan A (1.5% Daily ROI)',
        amount: 300,
        isCredit: true,
        status: 'Completed',
        method: 'Automated Daily Payout',
      },
    ];

    for (const txn of walletTxns) {
      await WalletTransaction.create({
        user: john._id,
        ...txn,
      });
    }

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Database name: naxachain on MongoDB Atlas');
    console.log('Demo Login: john@nexachain.ai | password: password123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedAtlas();
