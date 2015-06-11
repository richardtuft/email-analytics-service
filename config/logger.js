'use strict';

// External modules
const winston = require('winston');

// Internal modules
const config = require('./config');

const dsn = process.env.SENTRY_DSN;

if (dsn) {

    winston.transports.Sentry = require('winston-sentry');
    winston.add(winston.transports.Sentry, {
        dsn: dsn
    });
}

winston.level = config.logLevel;

module.exports = winston;