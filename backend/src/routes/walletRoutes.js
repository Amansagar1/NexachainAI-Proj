const express = require('express');
const walletController = require('../controllers/walletController');
const authenticate = require('../middleware/authenticate');
const { authorizeActive } = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate, authorizeActive);

router.get('/overview', walletController.getOverview);
router.get('/transactions', walletController.getTransactions);
router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);

module.exports = router;

