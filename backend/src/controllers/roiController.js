const roiService = require('../services/roiService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getRoiHistory = asyncHandler(async (req, res) => {
  const result = await roiService.getUserROIHistory(req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

/**
 * Manual development / testing trigger for Daily ROI calculation
 * Safe and idempotent
 */
const triggerDailyRoi = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const targetDate = date ? new Date(date) : new Date();

  const summary = await roiService.processDailyROI(targetDate);

  res.status(200).json({
    status: 'success',
    message: 'Daily ROI process executed successfully',
    data: summary,
  });
});

module.exports = {
  getRoiHistory,
  triggerDailyRoi,
};
