'use strict';

const logger = require('winston');
const eventParser = require('../utils/eventParser.server.utils');
const async = require ('async');


const config = require('../../config/config');
const queue = require('../services/queues.server.service');

logger.level = config.logLevel;

exports.handlePost = (req, res) => {

    const concurrentConnections = 100; //Use config/env

    let eventsArray = req.body;

    async.eachLimit(eventsArray, concurrentConnections, dealWithEvent, (eachErr) => {

        logger.info('Batch of messages sent to the queue');

        /* istanbul ignore next */
        if (eachErr) {
            logger.error(eachErr);
        }
    });

    // Do not wait for the array to be processed, send the Ack as soon as possible
    res.status(200).send('OK');

    function dealWithEvent (rawEvent, next) {
        let jEmailEvent = eventParser.parse(rawEvent);
        let emailEvent = JSON.stringify(jEmailEvent);

        logger.debug('Raw Event: ', rawEvent);
        logger.info('Received ' + jEmailEvent.type + ' event.');

        queue.addToQueue(emailEvent, (addErr, messageId) => {

            //TODO?: deal with error

            logger.debug('Message added to the queue: ', messageId);
            next();
        });

    }
};