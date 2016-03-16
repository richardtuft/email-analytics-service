'use strict';

// External modules
const winston = require('winston');

// Internal modules
const config = require('./config');

const dsn = process.env.SENTRY_DSN;

winston.level = config.logLevel;

if (process.env.NODE_ENV === 'test') {
    winston.remove(winston.transports.Console);
}

module.exports = winston;
