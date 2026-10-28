const mongoose = require('mongoose');
const User = require('../models/User');
const ReferralIncome = require('../models/ReferralIncome');
const {
  REFERRAL_COMMISSION_RATES,
  MAX_REFERRAL_DEPTH,
  REFERRAL_INCOME_TYPE,
} = require('../constants/businessRules');
const logger = require('../utils/logger');

/**
 * Distribute multi-level referral commissions upon investment creation
 * Uses transactions where supported or atomic operations
 */
const distributeReferralCommissions = async (investment, session = null) => {
  const investor = await User.findById(investment.user).session(session);
  if (!investor || !investor.referredBy) {
    return []; // No upline to distribute to
  }

  const distributedCommissions = [];
  let currentParentId = investor.referredBy;

  for (let level = 1; level <= MAX_REFERRAL_DEPTH; level++) {
    if (!currentParentId) break;

    const parentUser = await User.findById(currentParentId).session(session);
    if (!parentUser) break;

    // Check if parent account is active
    if (parentUser.accountStatus === 'Active') {
      const rate = REFERRAL_COMMISSION_RATES[level] || 0;
      if (rate > 0) {
        const commissionAmount = Math.round(investment.investmentAmount * rate * 100) / 100;

        if (commissionAmount > 0) {
          try {
            const incomeType =
              level === 1
                ? REFERRAL_INCOME_TYPE.DIRECT
                : REFERRAL_INCOME_TYPE.LEVEL;

            // Idempotent insertion using findOneAndUpdate with upsert or safe create
            // The unique index on { user, fromUser, investment, referralLevel } prevents duplicates
            const existing = await ReferralIncome.findOne({
              user: parentUser._id,
              fromUser: investor._id,
              investment: investment._id,
              referralLevel: level,
            }).session(session);

            if (!existing) {
              const record = await ReferralIncome.create(
                [
                  {
                    user: parentUser._id,
                    fromUser: investor._id,
                    referralLevel: level,
                    incomeAmount: commissionAmount,
                    incomeType,
                    investment: investment._id,
                    date: new Date(),
                    status: 'Credited',
                  },
                ],
                { session }
              );

              // Atomically credit upline user's wallet and total level income
              await User.findByIdAndUpdate(
                parentUser._id,
                {
                  $inc: {
                    walletBalance: commissionAmount,
                    totalLevelIncomeEarned: commissionAmount,
                  },
                },
                { session, new: true }
              );

              distributedCommissions.push(record[0]);
              logger.info(`Credited Level ${level} referral income of ₹${commissionAmount} to user ${parentUser._id}`);
            }
          } catch (err) {
            // If duplicate key error (E11000), ignore as it was already credited
            if (err.code === 11000) {
              logger.warn(`Duplicate referral commission attempt blocked for user ${parentUser._id}, level ${level}`);
            } else {
              throw err;
            }
          }
        }
      }
    }

    // Traverse upwards to next parent
    currentParentId = parentUser.referredBy;
  }

  return distributedCommissions;
};

/**
 * Fetch direct referrals for a user
 */
const getDirectReferrals = async (userId) => {
  const referrals = await User.find({ referredBy: userId })
    .select('fullName email mobileNumber referralCode walletBalance totalRoiEarned accountStatus createdAt')
    .sort({ createdAt: -1 });

  return referrals;
};

/**
 * Fetch complete referral tree (Levels 1 to 3) for the current user
 */
const getReferralTree = async (userId) => {
  const rootUser = await User.findById(userId).select(
    'fullName email referralCode walletBalance totalRoiEarned totalLevelIncomeEarned createdAt accountStatus'
  );

  if (!rootUser) {
    throw new Error('User not found');
  }

  // Helper recursive builder up to MAX_REFERRAL_DEPTH
  const buildSubtree = async (parentId, currentLevel) => {
    if (currentLevel > MAX_REFERRAL_DEPTH) return [];

    const children = await User.find({ referredBy: parentId }).select(
      'fullName email referralCode walletBalance totalRoiEarned totalLevelIncomeEarned createdAt accountStatus'
    );

    const formattedChildren = [];
    for (const child of children) {
      // Count direct referrals for this child
      const directCount = await User.countDocuments({ referredBy: child._id });
      const nextChildren = await buildSubtree(child._id, currentLevel + 1);

      formattedChildren.push({
        _id: child._id,
        fullName: child.fullName,
        email: child.email,
        referralCode: child.referralCode,
        level: currentLevel,
        directReferralsCount: directCount,
        totalEarned: (child.totalRoiEarned || 0) + (child.totalLevelIncomeEarned || 0),
        status: child.accountStatus,
        createdAt: child.createdAt,
        children: nextChildren,
      });
    }

    return formattedChildren;
  };

  const level1Children = await buildSubtree(rootUser._id, 1);

  // Compute aggregate network statistics
  const directReferralsCount = level1Children.length;

  let level2Count = 0;
  let level3Count = 0;
  let level1Income = 0;
  let level2Income = 0;
  let level3Income = 0;

  // Aggregate commissions from ReferralIncome
  const commissions = await ReferralIncome.find({ user: userId });
  commissions.forEach((c) => {
    if (c.referralLevel === 1) level1Income += c.incomeAmount;
    else if (c.referralLevel === 2) level2Income += c.incomeAmount;
    else if (c.referralLevel === 3) level3Income += c.incomeAmount;
  });

  level1Children.forEach((l1) => {
    level2Count += l1.children.length;
    l1.children.forEach((l2) => {
      level3Count += l2.children.length;
    });
  });

  const totalReferrals = directReferralsCount + level2Count + level3Count;

  return {
    root: {
      _id: rootUser._id,
      fullName: rootUser.fullName,
      email: rootUser.email,
      referralCode: rootUser.referralCode,
      level: 0,
      directReferralsCount,
      totalReferrals,
      totalLevelIncome: rootUser.totalLevelIncomeEarned || 0,
      children: level1Children,
    },
    summary: {
      totalReferrals,
      directReferrals: directReferralsCount,
      totalTeamSize: totalReferrals + 1, // User + team
      totalLevelIncome: rootUser.totalLevelIncomeEarned || 0,
      levelBreakdown: [
        { level: 1, name: 'Level 1 (Direct)', users: directReferralsCount, income: level1Income },
        { level: 2, name: 'Level 2', users: level2Count, income: level2Income },
        { level: 3, name: 'Level 3', users: level3Count, income: level3Income },
      ],
    },
  };
};

/**
 * Get paginated Referral Income history with filters
 */
const getReferralIncomeHistory = async (userId, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: userId };

  if (query.level && query.level !== 'All' && !isNaN(parseInt(query.level, 10))) {
    filter.referralLevel = parseInt(query.level, 10);
  }

  if (query.type && query.type !== 'All') {
    filter.incomeType = query.type;
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  const [records, total] = await Promise.all([
    ReferralIncome.find(filter)
      .populate('fromUser', 'fullName email referralCode')
      .populate('investment', 'investmentAmount planDetails')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    ReferralIncome.countDocuments(filter),
  ]);

  // Aggregate metrics for summary cards & charts
  const allUserCommissions = await ReferralIncome.find({ user: userId });
  let totalLevelIncome = 0;
  let directIncome = 0;
  let l1Income = 0;
  let l2Income = 0;
  let l3Income = 0;

  allUserCommissions.forEach((c) => {
    totalLevelIncome += c.incomeAmount;
    if (c.referralLevel === 1) {
      directIncome += c.incomeAmount;
      l1Income += c.incomeAmount;
    } else if (c.referralLevel === 2) {
      l2Income += c.incomeAmount;
    } else if (c.referralLevel === 3) {
      l3Income += c.incomeAmount;
    }
  });

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    metrics: {
      totalLevelIncome,
      directIncome,
      l1Income,
      l2Income,
      l3Income,
    },
  };
};

module.exports = {
  distributeReferralCommissions,
  getDirectReferrals,
  getReferralTree,
  getReferralIncomeHistory,
};
