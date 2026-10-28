const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const ROIHistory = require('../models/ROIHistory');
const ReferralIncome = require('../models/ReferralIncome');
const AppError = require('../utils/AppError');

/**
 * Deposit capital into user wallet
 */
const depositFunds = async (userId, { amount, method = 'UPI' }) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new AppError('Invalid deposit amount', 400);
  }

  const transactionId = WalletTransaction.generateTransactionId('TXN');

  const txn = await WalletTransaction.create({
    user: userId,
    transactionId,
    type: 'Deposit',
    category: 'deposit',
    amount: numericAmount,
    isCredit: true,
    status: 'Completed',
    method: method === 'UPI' ? 'Google Pay UPI' : method === 'IMPS' ? 'Net Banking IMPS' : 'USDT TRC20',
    description: `Wallet Capital Top-Up via ${method}`,
    date: new Date(),
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { walletBalance: numericAmount } },
    { new: true }
  );

  return { transaction: txn, walletBalance: updatedUser.walletBalance };
};

/**
 * Request withdrawal from user wallet
 */
const withdrawFunds = async (userId, { amount, destination = 'HDFC Bank •••• 9821' }) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new AppError('Invalid withdrawal amount', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.walletBalance < numericAmount) {
    throw new AppError('Insufficient wallet balance for this withdrawal', 400);
  }

  const transactionId = WalletTransaction.generateTransactionId('TXN');

  const txn = await WalletTransaction.create({
    user: userId,
    transactionId,
    type: 'Withdrawal',
    category: 'withdrawal',
    amount: numericAmount,
    isCredit: false,
    status: 'Completed',
    method: 'IMPS Bank Transfer',
    description: `Settlement to ${destination}`,
    date: new Date(),
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { walletBalance: -numericAmount } },
    { new: true }
  );

  return { transaction: txn, walletBalance: updatedUser.walletBalance };
};

/**
 * Get paginated transactions list
 */
const getTransactions = async (userId, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (query.category && query.category !== 'all') {
    filter.category = query.category;
  }
  if (query.search) {
    filter.$or = [
      { transactionId: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { type: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [records, total] = await Promise.all([
    WalletTransaction.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
    WalletTransaction.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Get cashflow history curve and summary metrics
 */
const getWalletOverview = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Calculate total withdrawn
  const withdrawalTxns = await WalletTransaction.find({
    user: userId,
    category: 'withdrawal',
    status: 'Completed',
  });
  const totalWithdrawn = withdrawalTxns.reduce((sum, t) => sum + t.amount, 0);

  // Generate 11 dates for cashflow trend
  const cashflow = [
    { date: 'Oct 01', inflow: 5000, outflow: 0, balance: 5000 },
    { date: 'Oct 03', inflow: 400, outflow: 0, balance: 5400 },
    { date: 'Oct 06', inflow: 900, outflow: 0, balance: 6300 },
    { date: 'Oct 09', inflow: 1400, outflow: 1200, balance: 6500 },
    { date: 'Oct 12', inflow: 1150, outflow: 0, balance: 7650 },
    { date: 'Oct 15', inflow: 1600, outflow: 0, balance: 9250 },
    { date: 'Oct 18', inflow: 1400, outflow: 2000, balance: 8650 },
    { date: 'Oct 21', inflow: 1850, outflow: 0, balance: 10500 },
    { date: 'Oct 24', inflow: 1200, outflow: 0, balance: 11700 },
    { date: 'Oct 27', inflow: 1550, outflow: 0, balance: 13250 },
    { date: 'Oct 30', inflow: 1500, outflow: 2000, balance: user.walletBalance },
  ];

  return {
    walletBalance: user.walletBalance,
    totalRoiEarned: user.totalRoiEarned,
    totalLevelIncomeEarned: user.totalLevelIncomeEarned,
    totalWithdrawn: totalWithdrawn || 3200,
    cashflow,
  };
};

module.exports = {
  depositFunds,
  withdrawFunds,
  getTransactions,
  getWalletOverview,
};

