const AppError = require('../utils/AppError');

/**
 * Restrict access to active users or specific resource owners
 */
const authorizeActive = (req, res, next) => {
  if (!req.user || req.user.accountStatus !== 'Active') {
    return next(new AppError('Your account is not active. Access denied.', 403));
  }
  next();
};

module.exports = {
  authorizeActive,
};
