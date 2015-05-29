'use strict';

// External modules
const dotEnv = require('dotenv');
const logger = require('winston');

try {
    // If we are on a hosted environment we won't probably have a .env file
    dotEnv.load();
}
catch (e) {
    // Do nothing
}

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const express = require('./config/express');

/* istanbul ignore next */
logger.level = process.env.LOG_LEVEL || config.logLevel;

let app = express();

app.listen(config.port);

module.exports = app;

logger.info(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);