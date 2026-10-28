const cron = require('node-cron');
const env = require('../config/env');
const { processDailyROI } = require('../services/roiService');
const logger = require('../utils/logger');

let cronJob = null;
let isJobRunning = false;

/**
 * Initialize automated Daily ROI scheduler
 * Schedule: Every day at 12:00 AM (00:00)
 */
const initRoiScheduler = () => {
  // '0 0 * * *' = at 00:00 every day
  const cronExpression = '0 0 * * *';

  cronJob = cron.schedule(
    cronExpression,
    async () => {
      if (isJobRunning) {
        logger.warn('Previous Daily ROI execution is still running. Skipping overlapping execution.');
        return;
      }

      isJobRunning = true;
      logger.info('Executing scheduled Daily ROI cron job at 12:00 AM...');

      try {
        const result = await processDailyROI(new Date());
        logger.info('Scheduled Daily ROI job completed successfully:', result);
      } catch (err) {
        logger.error('Error during scheduled Daily ROI execution:', err);
      } finally {
        isJobRunning = false;
      }
    },
    {
      scheduled: true,
      timezone: env.ROI_TIMEZONE,
    }
  );

  logger.info(`Daily ROI Scheduler initialized. Schedule: '${cronExpression}' [Timezone: ${env.ROI_TIMEZONE}]`);
};

const stopRoiScheduler = () => {
  if (cronJob) {
    cronJob.stop();
    logger.info('Daily ROI Scheduler stopped.');
  }
};

module.exports = {
  initRoiScheduler,
  stopRoiScheduler,
};
