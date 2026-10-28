const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authenticate');
const { authorizeActive } = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate, authorizeActive);

router.get('/summary', dashboardController.getSummary);
router.get('/earnings', dashboardController.getEarnings);

module.exports = router;
