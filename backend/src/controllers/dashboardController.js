const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary(req.user._id);

  res.status(200).json({
    status: 'success',
    data: summary,
  });
});

const getEarnings = asyncHandler(async (req, res) => {
  const period = req.query.period || '30d';
  const chartData = await dashboardService.getDashboardEarningsChart(req.user._id, period);

  res.status(200).json({
    status: 'success',
    data: chartData,
  });
});

module.exports = {
  getSummary,
  getEarnings,
};
