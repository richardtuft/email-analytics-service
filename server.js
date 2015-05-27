'use strict';

const logger = require('winston');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./config/config');
const express = require('./config/express');

logger.level = process.env.LOG_LEVEL || config.logLevel;

let app = express();

app.listen(config.port);

module.exports = app;

logger.info(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);