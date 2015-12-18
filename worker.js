'use strict';

// External modules
require('dotenv').load({silent: true});
require('./config/sentry').init();

const async = require('async');
const throng = require('throng');

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const queue = require('./app/services/queues.server.service');
const spoor = require('./app/services/spoor.server.services');
const shutdown = require('./app/utils/shutdown.server.utils');
const forever = require('./app/utils/forever.server.utils');
const logger = require('./config/logger');
const NoMessageInQueueError = require('./app/errors/noMessageInQueue.server.error');
const usersListsClient = require('./app/services/usersListsClient.server.services');

const loggerId = 'WORKER:' + config.processId;

throng(start, {
    workers: config.workers,
    lifetime: Infinity
});

function start () {

    logger.info(loggerId,  process.env.NODE_ENV + ' worker started');

    /* istanbul ignore next */
    process.on('SIGTERM', () => {
        shutdown(loggerId);
    });

    forever(() => {

        return new Promise ((fulfill, reject) => {

            async.times(10, moveToSpoor, (err) => {

                if (err) {
                    return reject(err);
                }

                return fulfill();

            });
        });

    }).catch((err) => {

        logger.error(loggerId, err);
        shutdown(loggerId);

    });

}

function moveToSpoor(n, next) {

    return queue.pullFromQueue()
        .then((messages) => {
            return Promise.all(messages.map(dealWithSingleMessage));
        })
        .then(() => next())
        .catch(function (error) {

            // If there are no messages queued we want to try again
            if (error instanceof NoMessageInQueueError) {
                logger.debug(loggerId, error.message);
                return next();
            }
            // If any other error happens, we want the loop to end
            else {
                return next(error);
            }

        });

}

function dealWithSingleMessage(message) {

    logger.debug(loggerId, message);

    return new Promise((fulfill, reject) => {

        return new Promise((innerFulfill, innerReject) => {
            // Suppress hard bounces
            let event = JSON.parse(message.Body);

            let uuid = event.user && event.user.ft_guid;

            //If we have the uuid and it is an hard bounce (or suppressed user) we want to mark the user as suppressed
            if (uuid && (isHardBounce(event) || isGenerationRejection(event))) {

                let toEdit = {
                    automaticallySuppressed: true
                };

                return usersListsClient
                    .editUser(uuid, toEdit)
                    .then(() => innerFulfill(event))
                    .catch(innerReject);

            } else {
                return innerFulfill(event);
            }

        })
        .then((event) => {

            // We only send events received in production to keen
            if (process.env.NODE_ENV === 'production') {
                return sendToKeen(event);
            }

            else return event;
        })
        .then(() => {
            return spoor.send(message.Body)
        })
        .then(() => {
                return queue.deleteFromQueue(message.ReceiptHandle);
        })
        .then(() => {
            message = null;
            return fulfill();
        })
        .catch(reject);

    });
}

function sendToKeen (event) {
    const keenClient = require('./config/keen');
    return new Promise((fullfill, reject) => {
        keenClient.addEvent('events', event, (err, res) => {

            if (err) {
                return reject(err);
            }

            return fullfill(res);

        });
    });
}

function isHardBounce (event) {
    let action = event.action;
    let bounceClass = event.context.bounceClass;
    return (action === 'bounce' || action === 'out_of_band') && (bounceClass === '10' || bounceClass === '30' || bounceClass === '90');
}

function isGenerationRejection (event) {
    return event.action === 'generation_rejection';
}

