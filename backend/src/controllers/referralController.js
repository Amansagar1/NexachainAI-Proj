const referralService = require('../services/referralService');
const asyncHandler = require('../utils/asyncHandler');

const getDirectReferrals = asyncHandler(async (req, res) => {
  const referrals = await referralService.getDirectReferrals(req.user._id);

  res.status(200).json({
    status: 'success',
    data: {
      referrals,
      count: referrals.length,
    },
  });
});

const getReferralTree = asyncHandler(async (req, res) => {
  const treeData = await referralService.getReferralTree(req.user._id);

  res.status(200).json({
    status: 'success',
    data: treeData,
  });
});

const getReferralIncome = asyncHandler(async (req, res) => {
  const result = await referralService.getReferralIncomeHistory(req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

module.exports = {
  getDirectReferrals,
  getReferralTree,
  getReferralIncome,
};
