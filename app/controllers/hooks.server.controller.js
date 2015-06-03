'use strict';

const logger = require('winston');
const eventParser = require('../utils/eventParser.server.utils');
const async = require ('async');


const config = require('../../config/config');
const queue = require('../services/queues.server.service');

const loggerId = 'HOOKS:' + config.processId;

logger.level = config.logLevel;

exports.handlePost = (req, res) => {

    const concurrentConnections = 100; //Use config/env

    let eventsArray = req.body;

    logger.info(loggerId, 'Batch of messages received', {SIZE: eventsArray.length});

    async.eachLimit(eventsArray, concurrentConnections, dealWithEvent, (eachErr) => {

        logger.info(loggerId, 'Batch of messages sent to the queue', {SIZE: eventsArray.length});

        /* istanbul ignore next */
        if (eachErr) {
            logger.error(loggerId, eachErr);
        }
    });

    // Do not wait for the array to be processed, send the Ack as soon as possible
    res.status(200).send('OK');

};

function dealWithEvent (rawEvent, next) {

    let jEmailEvent = eventParser.parse(rawEvent);
    let emailEvent = JSON.stringify(jEmailEvent);

    logger.debug(loggerId, 'Raw Event:', rawEvent);

    queue.addToQueue(emailEvent)
        .then(() => {
            logger.verbose(loggerId, 'Message added to the queue');
            next();
        })
        .catch((addErr) => {
            /* istanbul ignore next */
            logger.error(loggerId, addErr);
            /* istanbul ignore next */
            next(addErr);
        });
}