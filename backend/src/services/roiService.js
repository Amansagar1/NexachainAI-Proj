const User = require('../models/User');
const Investment = require('../models/Investment');
const ROIHistory = require('../models/ROIHistory');
const { INVESTMENT_STATUS, ROI_STATUS } = require('../constants/businessRules');
const logger = require('../utils/logger');

/**
 * Helper to get date string in YYYY-MM-DD format
 */
const getDateString = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Daily ROI Processor - Idempotent, robust, and safe
 * Can be called by node-cron scheduler or manual trigger for testing
 */
const processDailyROI = async (targetDate = new Date()) => {
  const earningDateStr = getDateString(targetDate);
  const now = new Date(targetDate);

  logger.info(`Starting Daily ROI processing for date: ${earningDateStr}`);

  // Find all active investments
  const activeInvestments = await Investment.find({
    investmentStatus: INVESTMENT_STATUS.ACTIVE,
  }).populate('user', 'accountStatus');

  let processed = 0;
  let credited = 0;
  let skipped = 0;
  let completed = 0;
  let totalAmountCredited = 0;
  const errors = [];

  for (const investment of activeInvestments) {
    processed++;

    try {
      // 1) Verify user exists and is active
      if (!investment.user || investment.user.accountStatus !== 'Active') {
        skipped++;
        continue;
      }

      // 2) Check if investment has reached end date
      if (now > investment.endDate) {
        investment.investmentStatus = INVESTMENT_STATUS.COMPLETED;
        await investment.save();
        completed++;
        continue;
      }

      // 3) Check if investment has already started
      if (now < investment.startDate) {
        skipped++;
        continue;
      }

      // 4) Idempotency check: Has ROI already been generated for this investment on this date?
      const existingROI = await ROIHistory.findOne({
        investment: investment._id,
        earningDateStr,
      });

      if (existingROI) {
        skipped++;
        continue;
      }

      // 5) Calculate daily ROI amount: (Principal * dailyRoiPercentage) / 100
      const calculatedRoi =
        Math.round((investment.investmentAmount * investment.dailyRoiPercentage) / 100 * 100) / 100;

      if (calculatedRoi <= 0) {
        skipped++;
        continue;
      }

      // 6) Create ROI history record with unique compound key protection
      try {
        await ROIHistory.create({
          user: investment.user._id,
          investment: investment._id,
          roiAmount: calculatedRoi,
          dailyRoiPercentage: investment.dailyRoiPercentage,
          date: now,
          earningDateStr,
          status: ROI_STATUS.CREDITED,
          remarks: 'Daily ROI credited successfully',
        });
      } catch (insertErr) {
        if (insertErr.code === 11000) {
          // E11000 duplicate key error caught - idempotency safely preserved!
          skipped++;
          continue;
        }
        throw insertErr;
      }

      // 7) Atomically update User wallet and Investment cumulative total
      await User.findByIdAndUpdate(investment.user._id, {
        $inc: {
          walletBalance: calculatedRoi,
          totalRoiEarned: calculatedRoi,
        },
      });

      investment.totalRoiEarned = (investment.totalRoiEarned || 0) + calculatedRoi;
      await investment.save();

      credited++;
      totalAmountCredited += calculatedRoi;
    } catch (err) {
      logger.error(`Error processing ROI for investment ${investment._id}:`, err);
      errors.push({ investmentId: investment._id, error: err.message });
    }
  }

  logger.info(
    `Daily ROI processing completed: ${credited} credited, ${skipped} skipped, ${completed} completed, Total: ₹${totalAmountCredited}`
  );

  return {
    earningDateStr,
    processed,
    credited,
    skipped,
    completed,
    totalAmountCredited: Math.round(totalAmountCredited * 100) / 100,
    errors,
  };
};

/**
 * Get paginated ROI history and aggregate analytics for a user
 */
const getUserROIHistory = async (userId, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: userId };

  if (query.investmentId) {
    filter.investment = query.investmentId;
  }

  if (query.status) {
    filter.status = query.status;
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
    ROIHistory.find(filter)
      .populate('investment', 'investmentAmount planDetails startDate endDate')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    ROIHistory.countDocuments(filter),
  ]);

  // Aggregate user statistics
  const allUserRoi = await ROIHistory.find({ user: userId })
    .populate('investment', 'planDetails investmentAmount')
    .sort({ date: 1 });

  let totalRoiEarned = 0;
  const uniqueDates = new Set();
  const planDistributionMap = {};
  const dailyTrendMap = {};

  allUserRoi.forEach((item) => {
    totalRoiEarned += item.roiAmount;
    uniqueDates.add(item.earningDateStr);

    const planName = item.investment?.planDetails?.planName || 'Standard Plan';
    planDistributionMap[planName] = (planDistributionMap[planName] || 0) + item.roiAmount;

    dailyTrendMap[item.earningDateStr] = (dailyTrendMap[item.earningDateStr] || 0) + item.roiAmount;
  });

  const totalRoiDays = uniqueDates.size;
  const averageDailyRoi = totalRoiDays > 0 ? Math.round((totalRoiEarned / totalRoiDays) * 100) / 100 : 0;

  const activeInvestmentsCount = await Investment.countDocuments({
    user: userId,
    investmentStatus: INVESTMENT_STATUS.ACTIVE,
  });

  const distribution = Object.keys(planDistributionMap).map((planName) => ({
    name: planName,
    amount: planDistributionMap[planName],
    percentage:
      totalRoiEarned > 0
        ? Math.round((planDistributionMap[planName] / totalRoiEarned) * 100)
        : 0,
  }));

  const trend = Object.keys(dailyTrendMap)
    .sort()
    .map((dateStr) => ({
      date: dateStr,
      amount: dailyTrendMap[dateStr],
    }));

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    metrics: {
      totalRoiEarned: Math.round(totalRoiEarned * 100) / 100,
      totalRoiDays,
      averageDailyRoi,
      activeInvestmentsCount,
      distribution,
      trend,
    },
  };
};

module.exports = {
  processDailyROI,
  getUserROIHistory,
  getDateString,
};
