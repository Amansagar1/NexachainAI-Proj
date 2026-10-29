const rateLimit = require('express-rate-limit');

// ------------------------------ Auth Rate Limiter ------------------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
});

// ------------------------------ General API Rate Limiter ------------------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again later',
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
