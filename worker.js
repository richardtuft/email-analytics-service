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

logger.level = config.logLevel;

throng(start);

function start () {

    logger.info(process.env.NODE_ENV + ' worker started');

    process.on('SIGTERM', shutdown);

    async.forever(moveToSpoor, (err) => {
        logger.error(err);
    });

    function moveToSpoor (next) {

        logger.info('Looking for new messages to move');

        queue.pullFromQueue((pullErr, data) => {
            if (pullErr) {
                next(pullErr);
            }
            if (data) {
                let emailEvent = data.body;
                let receiptHandle = data.receiptHandle;

                spoor.send(emailEvent)
                    .then(() => {
                        queue.deleteFromQueue(receiptHandle, (delErr) => {
                            if (delErr) {
                                next(delErr);
                            }
                            logger.debug('Moved message from SQS to Spoor');
                            next();

                        });
                    })
                    .catch(next);
            }
        });

    }

    function shutdown() {
        logger.info(process.env.NODE_ENV + ' worker shutting down');
        process.exit();
    }

}
