const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { fullName, email, mobileNumber, password, referralCode } = req.body;
  const result = await authService.registerUser({
    fullName,
    email,
    mobileNumber,
    password,
    referralCode,
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: result,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

module.exports = {
  register,
  login,
  getMe,
  logout,
};
