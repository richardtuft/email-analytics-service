'use strict';

require('dotenv').load({silent: true});

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const throng = require('throng');
const config = require('./config/config');
const shutdown = require('./app/utils/shutdown.server.utils');
const Queue = require('./app/services/queues.server.service');

const loggerId = 'SERVER:' + config.processId;

function start() {

  console.log('starting event worker');

  let instance = new Queue(config, config.eventPrefetchLimit);

  instance.on('ready', beginWork);
  process.on('SIGTERM', () => shutdown(loggerId, instance));

  function beginWork() {
    console.log('worker ready to process queue');
    instance.startConsumingEvents();
  }
}

throng(start, {workers: config.workers, lifetime: Infinity});
