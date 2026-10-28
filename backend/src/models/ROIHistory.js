const mongoose = require('mongoose');
const { ROI_STATUS } = require('../constants/businessRules');

const roiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: [true, 'Investment reference is required'],
      index: true,
    },
    roiAmount: {
      type: Number,
      required: [true, 'ROI amount is required'],
      min: [0, 'ROI amount cannot be negative'],
    },
    dailyRoiPercentage: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    earningDateStr: {
      type: String, // e.g. "2026-10-28" for idempotent daily unique key
      required: [true, 'Earning date string is required for idempotency'],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ROI_STATUS),
      default: ROI_STATUS.CREDITED,
    },
    remarks: {
      type: String,
      default: 'Daily ROI credited successfully',
    },
  },
  {
    timestamps: true,
  }
);

// Idempotency constraint: An investment can only have ONE ROI calculation per earning date!
roiHistorySchema.index({ investment: 1, earningDateStr: 1 }, { unique: true });
roiHistorySchema.index({ user: 1, date: -1 });

const ROIHistory = mongoose.model('ROIHistory', roiHistorySchema);
module.exports = ROIHistory;
