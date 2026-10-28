const User = require('../models/User');
const Investment = require('../models/Investment');
const ROIHistory = require('../models/ROIHistory');
const ReferralIncome = require('../models/ReferralIncome');
const { INVESTMENT_STATUS } = require('../constants/businessRules');

/**
 * Get comprehensive dashboard overview metrics
 */
const getDashboardSummary = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 1) Investments
  const investments = await Investment.find({ user: userId }).sort({ createdAt: -1 });
  let totalInvestmentAmount = 0;
  let activePlansCount = 0;
  let expectedDailyRoi = 0;

  investments.forEach((inv) => {
    totalInvestmentAmount += inv.investmentAmount;
    if (inv.investmentStatus === INVESTMENT_STATUS.ACTIVE) {
      activePlansCount++;
      expectedDailyRoi += (inv.investmentAmount * inv.dailyRoiPercentage) / 100;
    }
  });

  expectedDailyRoi = Math.round(expectedDailyRoi * 100) / 100;

  // 2) Recent investments (last 5)
  const recentInvestments = investments.slice(0, 5).map((inv) => ({
    _id: inv._id,
    planName: inv.planDetails.planName,
    amount: inv.investmentAmount,
    startDate: inv.startDate,
    endDate: inv.endDate,
    status: inv.investmentStatus,
  }));

  // 3) Recent earnings (merge ROIHistory & ReferralIncome)
  const [recentRoi, recentReferrals] = await Promise.all([
    ROIHistory.find({ user: userId }).sort({ date: -1 }).limit(5),
    ReferralIncome.find({ user: userId }).sort({ date: -1 }).limit(5),
  ]);

  const recentEarnings = [
    ...recentRoi.map((r) => ({
      type: 'Daily ROI',
      amount: r.roiAmount,
      date: r.date,
      status: r.status,
      iconType: 'roi',
    })),
    ...recentReferrals.map((ref) => ({
      type: `Level Income (L${ref.referralLevel})`,
      amount: ref.incomeAmount,
      date: ref.date,
      status: ref.status,
      iconType: 'referral',
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // 4) Referral stats
  const directReferrals = await User.find({ referredBy: userId }).select('fullName referralCode createdAt');
  const directReferralsCount = directReferrals.length;

  // Get total indirect referrals count
  const allSubReferrals = await User.find({
    referredBy: { $in: directReferrals.map((d) => d._id) },
  }).select('_id');
  const level3Referrals = await User.find({
    referredBy: { $in: allSubReferrals.map((s) => s._id) },
  }).select('_id');

  const totalReferrals = directReferralsCount + allSubReferrals.length + level3Referrals.length;

  return {
    kpis: {
      totalInvestments: {
        amount: totalInvestmentAmount,
        activePlansCount,
        label: 'Total Investments',
      },
      dailyRoi: {
        amount: expectedDailyRoi,
        label: 'Daily ROI',
        subtext: 'From active investments',
      },
      totalLevelIncome: {
        amount: user.totalLevelIncomeEarned || 0,
        label: 'Total Level Income',
        subtext: 'From 3 levels',
      },
      walletBalance: {
        amount: user.walletBalance || 0,
        label: 'Wallet Balance',
        subtext: 'Available balance',
      },
    },
    user: {
      fullName: user.fullName,
      email: user.email,
      referralCode: user.referralCode,
      walletBalance: user.walletBalance,
    },
    referralSummary: {
      referralCode: user.referralCode,
      directReferrals: directReferralsCount,
      totalReferrals,
      totalLevelIncome: user.totalLevelIncomeEarned || 0,
      recentDirectUsers: directReferrals.slice(0, 4),
    },
    recentInvestments,
    recentEarnings,
  };
};

/**
 * Get unified earnings time-series for chart (ROI vs Referral Income)
 */
const getDashboardEarningsChart = async (userId, period = '30d') => {
  let days = 30;
  if (period === '7d') days = 7;
  else if (period === '90d' || period === '3m') days = 90;
  else if (period === '365d' || period === '1y') days = 365;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [roiList, referralList] = await Promise.all([
    ROIHistory.find({ user: userId, date: { $gte: startDate } }).sort({ date: 1 }),
    ReferralIncome.find({ user: userId, date: { $gte: startDate } }).sort({ date: 1 }),
  ]);

  // Aggregate by date (YYYY-MM-DD)
  const chartMap = {};

  // Initialize all days in range for smooth charting
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().split('T')[0];
    const displayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    chartMap[key] = {
      date: key,
      displayDate: displayLabel,
      roiEarnings: 0,
      referralIncome: 0,
    };
  }

  roiList.forEach((item) => {
    const key = new Date(item.date).toISOString().split('T')[0];
    if (chartMap[key]) {
      chartMap[key].roiEarnings += item.roiAmount;
    }
  });

  referralList.forEach((item) => {
    const key = new Date(item.date).toISOString().split('T')[0];
    if (chartMap[key]) {
      chartMap[key].referralIncome += item.incomeAmount;
    }
  });

  const chartData = Object.values(chartMap);
  return { period, data: chartData };
};

module.exports = {
  getDashboardSummary,
  getDashboardEarningsChart,
};
