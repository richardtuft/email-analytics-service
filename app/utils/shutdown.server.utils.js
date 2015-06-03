'use strict';

// External modules
const logger = require('winston');

// Internal modules
const config = require('../../config/config');

logger.level = config.logLevel;

/* istanbul ignore next */
module.exports = (loggerId) => {
    logger.info(loggerId,  process.env.NODE_ENV + ' worker shutting down');
    process.exit();
};