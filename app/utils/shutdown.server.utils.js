'use strict';

// Internal modules
const logger = require('../../config/logger');

/* istanbul ignore next */
module.exports = (loggerId) => {
    logger.info(loggerId,  process.env.NODE_ENV + ' worker shutting down');
    process.exit();
};