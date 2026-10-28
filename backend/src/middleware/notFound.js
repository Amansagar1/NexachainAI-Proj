const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Endpoint ${req.originalUrl} not found on this server`, 404));
};

module.exports = notFound;
