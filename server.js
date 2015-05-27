'use strict';

// External modules
const logger = require('winston');

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const express = require('./config/express');

let app = express();

app.listen(config.port);

module.exports = app;

logger.info(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);