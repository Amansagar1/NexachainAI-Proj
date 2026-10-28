const { body } = require('express-validator');
const { INVESTMENT_PLANS } = require('../constants/businessRules');

const validPlanIds = Object.values(INVESTMENT_PLANS).map((p) => p.id);

const validateCreateInvestment = [
  body('planId')
    .notEmpty()
    .withMessage('Plan ID is required')
    .isIn(validPlanIds)
    .withMessage(`Invalid plan ID. Must be one of: ${validPlanIds.join(', ')}`),
  body('amount')
    .notEmpty()
    .withMessage('Investment amount is required')
    .isFloat({ min: 1 })
    .withMessage('Investment amount must be a positive number')
    .custom((value, { req }) => {
      const selectedPlan = Object.values(INVESTMENT_PLANS).find(
        (p) => p.id === req.body.planId
      );
      if (selectedPlan && value < selectedPlan.minInvestment) {
        throw new Error(
          `Minimum investment amount for ${selectedPlan.name} is ₹${selectedPlan.minInvestment.toLocaleString()}`
        );
      }
      return true;
    }),
];

module.exports = {
  validateCreateInvestment,
};
