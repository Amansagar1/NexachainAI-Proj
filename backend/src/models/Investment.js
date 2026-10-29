const mongoose = require('mongoose');
const { INVESTMENT_STATUS } = require('../constants/businessRules');

const planDetailsSchema = new mongoose.Schema(
  {
    planId: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    subtitle: String,
    color: String,
  },
  { _id: false }
);

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    investmentAmount: {
      type: Number,
      required: [true, 'Investment amount is required'],
      min: [1, 'Investment amount must be greater than zero'],
    },
    planDetails: {
      type: planDetailsSchema,
      required: [true, 'Plan details are required'],
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    dailyRoiPercentage: {
      type: Number,
      required: [true, 'Daily ROI percentage is required'],
      min: [0, 'Daily ROI percentage cannot be negative'],
    },
    totalRoiEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    investmentStatus: {
      type: String,
      enum: Object.values(INVESTMENT_STATUS),
      default: INVESTMENT_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ------------------------------ Indexes for Query Optimization ------------------------------
investmentSchema.index({ investmentStatus: 1, startDate: 1, endDate: 1 });
investmentSchema.index({ user: 1, createdAt: -1 });

const Investment = mongoose.model('Investment', investmentSchema);
module.exports = Investment;
