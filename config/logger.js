'use strict';

// External modules
const logger = require('winston');

// Internal modules
const config = require('./config');

logger.level = config.logLevel;

module.exports = logger;