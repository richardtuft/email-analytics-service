'use strict';

require('dotenv').load({silent: true});

// External modules
const throng = require('throng');
const logger = require('winston');
const async = require('async');

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const queue = require('./app/services/queues.server.service');
const spoor = require('./app/services/spoor.server.services');
const NoMessageInQueue = require('./app/errors/noMessageInQueue.server.error');

logger.level = config.logLevel;

let receiptHandle;

throng(start);

function start () {
    logger.info('WORKER.JS:',  process.env.NODE_ENV + ' worker started');

    process.on('SIGTERM', shutdown);

    async.forever(moveToSpoor, (err) => {

        logger.error('WORKER.JS:', err);
        shutdown();

    });

    function moveToSpoor(next) {

        logger.verbose('WORKER.JS:',  'Looking for new messages to move');



        queue.pullFromQueue()
            .then((data) => {
                logger.verbose('WORKER.JS:', 'Message retrieved from the queue');
                let emailEvent = data.body;
                receiptHandle = data.receiptHandle;
                return spoor.send(emailEvent);
            })
            .then(() => {
                return queue.deleteFromQueue(receiptHandle);
            })
            .then(() => {
                logger.verbose('WORKER.JS:',  'Message moved to Spoor');
                next();
            })
            .catch(function (error) {
                // If we have no message we want to wait for some time and then try again
                if (error instanceof NoMessageInQueue) {
                    let waitWhenEmpty = 1000; //TODO: use config/env
                    logger.info('WORKER.JS', error.message);
                    logger.info('WORKER.JS', 'Trying again in ' + waitWhenEmpty + 'ms');
                    setTimeout(next, waitWhenEmpty);
                }
                // If any other error happens, we want the loop to end
                else {
                    next(error);
                }

            });

    }

    function shutdown() {
        logger.info('WORKER.JS:',  process.env.NODE_ENV + ' worker shutting down');
        process.exit();
    }

}
