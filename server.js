'use strict';

// External modules
require('dotenv').load({silent: true});

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const Queue = require('./app/services/queues.server.service');
const queue = new Queue(config);
const mongoose = require('./config/mongoose')();
const app = require('./config/express')(queue);
const shutdown = require('./app/utils/shutdown.server.utils');
const logger = require('./config/logger');
const sentry = require('./config/sentry').init();

const loggerId = 'SERVER:' + config.processId;

/* istanbul ignore next */
process.on('SIGTERM', () => shutdown(loggerId, queue));

queue.once('ready', () => {
       
  app.listen(config.port, () => {
    logger.info(loggerId, process.env.NODE_ENV +
        ' server running at http://localhost:' + config.port);
  });
});

module.exports = app;
