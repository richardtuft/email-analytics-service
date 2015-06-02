'use strict';

require('dotenv').load({silent: true});

// External modules
const throng = require('throng');
const logger = require('winston');
const memwatch = require('memwatch-next'); //TODO: Remove

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const queue = require('./app/services/queues.server.service');
const spoor = require('./app/services/spoor.server.services');
const NoMessageInQueue = require('./app/errors/noMessageInQueue.server.error');


let hd;
memwatch.on('leak', function(info) {
    console.error(info);
    if (!hd) {
        hd = new memwatch.HeapDiff();
    } else {
        var diff = hd.end();
        console.error(diff);
        hd = null;
    }
});

logger.level = config.logLevel;


throng(start, {
    workers: config.workers,
    lifetime: Infinity
});

function start () {

    logger.info('WORKER.JS:',  process.env.NODE_ENV + ' worker started');

    process.on('SIGTERM', shutdown);

    forever(moveToSpoor).then(null, (err) => {

        logger.error('WORKER.JS:', err);
        shutdown();

    });

    function forever (fn) {
        return fn().then(function () {
            return forever(fn);  // re-execute if successful
        })
    }

    function moveToSpoor() {

        logger.verbose('WORKER.JS:',  'Looking for new messages to move');

        let lastMessageFound;

        return new Promise((fulfill, reject) => {

            queue.pullFromQueue()
                .then((data) => {
                    logger.verbose('WORKER.JS:', 'Message retrieved from the queue');
                    lastMessageFound = data;
                    return spoor.send(lastMessageFound.body);
                })
                .then(() => {
                    return queue.deleteFromQueue(lastMessageFound.receiptHandle);
                })
                .then(() => {
                    logger.verbose('WORKER.JS:',  'Message moved to Spoor');
                    fulfill();

                })
                .catch(function (error) {
                    // If we have no message we want to wait for some time and then try again
                    if (error instanceof NoMessageInQueue) {
                        logger.info('WORKER.JS', error.message);
                        fulfill();
                    }
                    // If any other error happens, we want the loop to end
                    else {
                        reject(error);
                    }

                });
        });

    }

    function shutdown() {
        logger.info('WORKER.JS:',  process.env.NODE_ENV + ' worker shutting down');
        process.exit();
    }

}
