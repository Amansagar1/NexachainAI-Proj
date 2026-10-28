const express = require('express');
const investmentController = require('../controllers/investmentController');
const authenticate = require('../middleware/authenticate');
const { authorizeActive } = require('../middleware/authorize');
const { validateCreateInvestment } = require('../validators/investmentValidator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(authenticate, authorizeActive);

router.get('/plans', investmentController.getPlans);
router.post('/', validateCreateInvestment, validateRequest, investmentController.createInvestment);
router.get('/', investmentController.getMyInvestments);
router.get('/:id', investmentController.getInvestmentDetails);

module.exports = router;
