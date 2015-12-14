'use strict';

// External modules
require('dotenv').load({silent: true});
const async = require('async');
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



    // TODO: move to app/utils
    function moveToSpoor(n, next) {

        logger.profile('queue.pullFromQueue');
        logger.profile('moveToSpoor');
        return queue.pullFromQueue()
            .then((messages) => {
                logger.profile('queue.pullFromQueue');
                return Promise.all(messages.map(dealWithSingleMessage));
            }).then(() => {
                logger.profile('moveToSpoor');
                return next();
            })
            .catch((err) => {
                logger.error(err);
                next(err);
            });

    }

}

function dealWithSingleMessage(message) {

    logger.debug(loggerId, message);

    return new Promise((fulfill, reject) => {

        return new Promise((fulfill, reject) => {
            // Suppress hard bounces
            let event = JSON.parse(message.Body);

            let uuid = event.user && event.user.ft_guid;

            //If we have the uuid and it is an hard bounce (or suppressed user) we want to mark the user as suppressed
            if (uuid && (isHardBounce(event) || isGenerationRejection(event))) {

                let toEdit = {automaticallySuppressed: true};

                return usersListsClient
                    .editUser(uuid, toEdit)
                    .then(fulfill)
                    .catch(reject);

            } else {
                fulfill();
            }

        })
        .then(() => {
            logger.profile('spoor.send');
            return spoor.send(message.Body)
                .then(() => {
                    logger.profile('spoor.send');
                    logger.profile('queue.deleteFromQueue');
                    return queue.deleteFromQueue(message.ReceiptHandle);
                });
        })
        .then(() => {
            logger.profile('queue.deleteFromQueue');
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

function isHardBounce (event) {
    let action = event.action;
    let bounceClass = event.context.bounceClass;
    return (action === 'bounce' || action === 'out_of_band') && (bounceClass === '10' || bounceClass === '30' || bounceClass === '90');
}

function isGenerationRejection (event) {
    return event.action === 'generation_rejection';
}

