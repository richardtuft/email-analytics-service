'use strict';

// External modules
require('dotenv').load({silent: true});
const throng = require('throng');

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const sentry = require('./config/sentry').init();
const queue = require('./app/services/queues.server.service');
const spoor = require('./app/services/spoor.server.services');
const shutdown = require('./app/utils/shutdown.server.utils');
const forever = require('./app/utils/forever.server.utils');
const logger = require('./config/logger');
const NoMessageInQueue = require('./app/errors/noMessageInQueue.server.error');
const usersListsClient = require('./app/services/usersListsClient.server.services');
const dataAssurance = require('./app/services/dataAssurance.server.services');

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

    forever(moveToSpoor).catch((err) => {

        logger.error(loggerId, err);
        shutdown(loggerId);

    });

    // TODO: move to app/utils
    function moveToSpoor() {

        logger.verbose(loggerId,  'Looking for new messages to move');

        let lastMessageFound;

        return new Promise((fulfill, reject) => {

            queue.pullFromQueue()
                .then((data) => {
                    // Suppress hard bounces
                    let event = JSON.parse(data.body);

                    let uuid = event.user && event.user.ft_guid;

                    //If we have the uuid and it is an hard bounce (or suppressed user) we want to mark the user as suppressed
                    if (uuid && (isHardBounce(event) || isGenerationRejection(event))) {

                        let toEdit = { automaticallySuppressed: true };

                        logger.debug(loggerId, 'Suppressing user', uuid);

                        return usersListsClient
                            .editUser(uuid, toEdit)
                            .then(() => data);
                    }
                    else {
                        return data;
                    }
                })
                .then((data) => {
                    logger.verbose(loggerId, 'Message retrieved from the queue');
                    lastMessageFound = data;
                    logger.debug(loggerId, lastMessageFound.body);
                    return spoor.send(lastMessageFound.body);
                })
                .then(() => {
                    return queue.deleteFromQueue(lastMessageFound.receiptHandle);
                })
                .then(() => {
                    logger.info(loggerId, 'Message moved to Spoor');

                    // Create data assurance message
                    let dataAssurance = {
                        environment: process.env.NODE_ENV,
                        application: 'email-service',
                        metric: (JSON.parse(lastMessageFound.body)).action,
                        count: 1

                    };

                    return dataAssurance.send(JSON.stringify(dataAssurance));
                })
                .then(() => {
                    lastMessageFound = null;
                    fulfill();
                })
                .catch(function (error) {
                    // If there are no messages queued we want to try again
                    if (error instanceof NoMessageInQueue) {
                        logger.debug(loggerId, error.message);
                        fulfill();
                    }
                    // If any other error happens, we want the loop to end
                    else {
                        reject(error);
                    }

                });
        });

    }

}


function isHardBounce (event) {
    let action = event.action;
    let bounceClass = event.context.bounceClass;
    return (action === 'bounce' || action === 'out_of_band') && (bounceClass === '10' || bounceClass === '30' || bounceClass === '90');
}

function isGenerationRejection (event) {
    return event.action === 'generation_rejection';
}