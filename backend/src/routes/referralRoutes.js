const express = require('express');
const referralController = require('../controllers/referralController');
const authenticate = require('../middleware/authenticate');
const { authorizeActive } = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate, authorizeActive);

router.get('/direct', referralController.getDirectReferrals);
router.get('/tree', referralController.getReferralTree);
router.get('/income', referralController.getReferralIncome);

module.exports = router;
