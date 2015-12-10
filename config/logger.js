'use strict';

// External modules
const winston = require('winston');

// Internal modules
const config = require('./config');

const dsn = process.env.SENTRY_DSN;

winston.level = config.logLevel;

module.exports = winston;