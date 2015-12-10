'use strict';

// External modules
const eventParser = require('../utils/sparkPostEventParser.server.utils');
const async = require ('async');

// Internal modules
const config = require('../../config/config');
const logger = require('../../config/logger');
const queue = require('../services/queues.server.service');

const loggerId = 'HOOKS:' + config.processId;

exports.handlePost = (req, res) => {

    logger.info(loggerId, 'Batch of messages received', {SIZE: eventsArray.length});

    // Do not wait for the array to be processed, send the Ack as soon as possible
    res.status(200).send('OK');

    const concurrentConnections = 100; //Use config/env

    let eventsArray = req.body;

    async.eachLimit(eventsArray, concurrentConnections, dealWithEvent, (eachErr) => {

        logger.info(loggerId, 'Batch of messages sent to the queue', {SIZE: eventsArray.length});

        /* istanbul ignore next */
        if (eachErr) {
            logger.error(loggerId, eachErr);
        }
    });

};

function dealWithEvent (rawEvent, next) {

    // We do not want to log the email address
    delete rawEvent.msys.rcpt_to;

    let jEmailEvent = eventParser.parse(rawEvent);
    let emailEvent = JSON.stringify(jEmailEvent);

    logger.debug(loggerId, 'Raw Event:', rawEvent);

    queue.addToQueue(emailEvent)
        .then(() => {
            logger.silly(loggerId, 'Message added to the queue');
            next();
        })
        .catch((addErr) => {
            /* istanbul ignore next */
            logger.error(loggerId, addErr);
            /* istanbul ignore next */
            next(addErr);
        });
}
