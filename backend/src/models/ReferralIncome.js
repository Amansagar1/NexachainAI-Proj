const mongoose = require('mongoose');
const { REFERRAL_INCOME_TYPE } = require('../constants/businessRules');

const referralIncomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User who receives the income is required'],
      index: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User who generated the income is required'],
      index: true,
    },
    referralLevel: {
      type: Number,
      required: [true, 'Referral level is required'],
      enum: [1, 2, 3],
      index: true,
    },
    incomeAmount: {
      type: Number,
      required: [true, 'Income amount is required'],
      min: [0, 'Income amount cannot be negative'],
    },
    incomeType: {
      type: String,
      enum: Object.values(REFERRAL_INCOME_TYPE),
      default: REFERRAL_INCOME_TYPE.LEVEL,
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: [true, 'Triggering investment reference is required'],
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      default: 'Credited',
    },
  },
  {
    timestamps: true,
  }
);

// Idempotency: One commission per recipient per level for a specific investment
referralIncomeSchema.index(
  { user: 1, fromUser: 1, investment: 1, referralLevel: 1 },
  { unique: true }
);

const ReferralIncome = mongoose.model('ReferralIncome', referralIncomeSchema);
module.exports = ReferralIncome;
