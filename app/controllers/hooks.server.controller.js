'use strict';

const logger = require('winston');
const eventParser = require('../utils/eventParser.server.utils');
const async = require ('async');


const config = require('../../config/config');
const queue = require('../services/queues.server.service');

logger.level = config.logLevel;

function dealWithEvent (rawEvent, next) {
    let emailEvent = eventParser.parse(rawEvent);
    let jEmailEvent = JSON.stringify(emailEvent);

    logger.debug('Raw Event: ', rawEvent);
    logger.info('Received ' + emailEvent.type + ' event.');

    queue.addToQueue(jEmailEvent, (addErr, messageId) => {

        //TODO?: deal with error

        logger.debug('Message added to the queue: ', messageId);
        next();
    });


}

exports.handlePost = (req, res) => {

    const concurrentConnections = 100; //Use config/env

    let eventsArray = req.body;


    async.eachLimit(eventsArray, concurrentConnections, dealWithEvent, (eachErr) => {

        logger.info('Batch of messages sent to the queue');

        // TODO? deal with error
        //if (eachErr) {
        //    logger.error(eachErr);
        //}
    });

    // Do not wait for the array to be processed, send the Ack as soon as possible

    res.status(200).send('OK');
};