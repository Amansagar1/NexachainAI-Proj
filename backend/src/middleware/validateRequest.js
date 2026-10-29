const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// ------------------------------ Request Validator ------------------------------
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => `${err.path}: ${err.msg}`).join(', ');
    return next(new AppError(`Validation error: ${errorMessages}`, 400));
  }
  next();
};

module.exports = validateRequest;
