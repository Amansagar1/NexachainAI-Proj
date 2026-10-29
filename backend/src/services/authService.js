const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// ------------------------------ Generate Signed JWT ------------------------------
const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

// ------------------------------ Register New User ------------------------------
const registerUser = async ({ fullName, email, mobileNumber, password, referralCode }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email address already exists.', 409);
  }

  let parentUser = null;
  if (referralCode) {
    parentUser = await User.findOne({
      referralCode: referralCode.toUpperCase(),
      accountStatus: 'Active',
    });
    if (!parentUser) {
      throw new AppError('Invalid or inactive referral code provided.', 400);
    }
  }

  let newReferralCode;
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 10) {
    newReferralCode = User.generateReferralCode();
    const existing = await User.findOne({ referralCode: newReferralCode });
    if (!existing) isUnique = true;
    attempts++;
  }

  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    referralCode: newReferralCode,
    referredBy: parentUser ? parentUser._id : null,
    walletBalance: 0,
    totalRoiEarned: 0,
    totalLevelIncomeEarned: 0,
    accountStatus: 'Active',
  });

  const token = signToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

// ------------------------------ Authenticate User Login ------------------------------
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.accountStatus !== 'Active') {
    throw new AppError('Your account has been deactivated or suspended.', 403);
  }

  const token = signToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

// ------------------------------ Get Current User Profile ------------------------------
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).populate('referredBy', 'fullName email referralCode');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

// ------------------------------ Update User Profile ------------------------------
const updateProfile = async (userId, updates) => {
  const allowed = [
    'fullName',
    'mobileNumber',
    'city',
    'country',
    'address',
    'dateOfBirth',
    'gender',
    'settings',
    'bankDetails',
    'kyc',
  ];
  const updateData = {};
  allowed.forEach((field) => {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  return updatedUser;
};

// ------------------------------ Change User Password ------------------------------
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  return true;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
  signToken,
};
