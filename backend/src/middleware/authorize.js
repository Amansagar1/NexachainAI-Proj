const AppError = require('../utils/AppError');

// ------------------------------ Authorize Active User ------------------------------
const authorizeActive = (req, res, next) => {
  if (!req.user || req.user.accountStatus !== 'Active') {
    return next(new AppError('Your account is not active. Access denied.', 403));
  }
  next();
};

module.exports = {
  authorizeActive,
};
