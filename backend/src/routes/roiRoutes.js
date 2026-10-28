const express = require('express');
const roiController = require('../controllers/roiController');
const authenticate = require('../middleware/authenticate');
const { authorizeActive } = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate, authorizeActive);

router.get('/', roiController.getRoiHistory);
router.post('/process-daily', roiController.triggerDailyRoi);

module.exports = router;
