'use strict';

// External modules
const eventParser = require('../utils/sparkPostEventParser.server.utils');

// Internal modules
const config = require('../../config/config');
const logger = require('../../config/logger');
const Queue = require('../services/queues1.server.service');
const queue = new Queue(config);

const loggerId = 'HOOKS:' + config.processId;

exports.handlePost = (req, res) => {

    logger.profile('handlePost');

    let eventsArray = req.body;

    logger.info(loggerId, 'Batch of messages received', {SIZE: eventsArray.results.length});

    // Do not wait for the array to be processed, send the Ack as soon as possible
    res.status(200).send('OK');

    dealWithEvent(eventsArray);

};

function dealWithEvent (rawEvent, next) {

    // We do not want to log the email address
    //delete rawEvent.msys.rcpt_to;

    logger.profile('eventParser.parse');
    //let jEmailEvent = eventParser.parse(rawEvent);
    let jEmailEvent = rawEvent;
    let emailEvent = JSON.stringify(jEmailEvent);

    logger.debug(loggerId, 'Raw Event:', rawEvent);

    logger.profile('eventParser.parse');

    logger.profile('queue.addToQueue');

    queue.addToQueue(emailEvent)
        .then(() => {
            logger.profile('queue.addToQueue');
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
