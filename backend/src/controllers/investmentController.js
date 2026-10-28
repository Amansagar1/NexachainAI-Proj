const investmentService = require('../services/investmentService');
const asyncHandler = require('../utils/asyncHandler');

const getPlans = asyncHandler(async (req, res) => {
  const plans = investmentService.getAvailablePlans();

  res.status(200).json({
    status: 'success',
    data: { plans },
  });
});

const createInvestment = asyncHandler(async (req, res) => {
  const { planId, amount } = req.body;
  const investment = await investmentService.createInvestment(req.user._id, { planId, amount });

  res.status(201).json({
    status: 'success',
    message: 'Investment created successfully',
    data: { investment },
  });
});

const getMyInvestments = asyncHandler(async (req, res) => {
  const result = await investmentService.getUserInvestments(req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

const getInvestmentDetails = asyncHandler(async (req, res) => {
  const investment = await investmentService.getInvestmentById(req.user._id, req.params.id);

  res.status(200).json({
    status: 'success',
    data: { investment },
  });
});

module.exports = {
  getPlans,
  createInvestment,
  getMyInvestments,
  getInvestmentDetails,
};
