'use strict';

require('dotenv').load({silent: true});

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const throng = require('throng');
const config = require('./config');

function start() {
  const db = require('./db')(config);
  const SendQueue = require('./app/services/queue');

  console.log('starting worker');
  db.on('open', () => {

    let instance = new SendQueue(config);

    instance.on('ready', beginWork);
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    function shutdown() {
      console.log('shutting down');
      db.close(() => {
        // Make sure to disconnect from queue
        process.exit();
      });
    }

    function beginWork() {
      console.log('worker ready to process queue');
      instance.on('lost', shutdown);
      instance.startConsuming();
    }
  });
}

throng(start, {workers: config.workers, lifetime: Infinity});
