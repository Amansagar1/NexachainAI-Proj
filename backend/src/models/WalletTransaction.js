const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['Deposit', 'Withdrawal', 'ROI Payout', 'Referral Bonus'],
      required: true,
    },
    category: {
      type: String,
      enum: ['deposit', 'withdrawal', 'roi', 'referral'],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Amount must be at least 1'],
    },
    isCredit: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Processing', 'Failed'],
      default: 'Completed',
      index: true,
    },
    method: {
      type: String,
      default: 'IMPS Bank Transfer',
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

walletTransactionSchema.statics.generateTransactionId = function (prefix = 'TXN') {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
};

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
module.exports = WalletTransaction;

