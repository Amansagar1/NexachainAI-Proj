const walletService = require('../services/walletService');
const asyncHandler = require('../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  const result = await walletService.getWalletOverview(req.user._id);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

const getTransactions = asyncHandler(async (req, res) => {
  const result = await walletService.getTransactions(req.user._id, req.query);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

const deposit = asyncHandler(async (req, res) => {
  const result = await walletService.depositFunds(req.user._id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Deposit processed successfully',
    data: result,
  });
});

const withdraw = asyncHandler(async (req, res) => {
  const result = await walletService.withdrawFunds(req.user._id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Withdrawal requested successfully',
    data: result,
  });
});

module.exports = {
  getOverview,
  getTransactions,
  deposit,
  withdraw,
};

