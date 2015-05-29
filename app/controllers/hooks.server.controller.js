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

    logger.info('HOOKS:', 'Batch of messages received', {SIZE: eventsArray.length});

    logger.profile('HOOKS:', 'Batch of messages sent to the queue', {SIZE: eventsArray.length});
    async.eachLimit(eventsArray, concurrentConnections, dealWithEvent, (eachErr) => {

        logger.profile('HOOKS:', 'Batch of messages sent to the queue', {SIZE: eventsArray.length});

        /* istanbul ignore next */
        if (eachErr) {
            logger.error('HOOKS:',eachErr);
        }
    });

    // Do not wait for the array to be processed, send the Ack as soon as possible
    res.status(200).send('OK');

    function dealWithEvent (rawEvent, next) {
        let jEmailEvent = eventParser.parse(rawEvent);
        let emailEvent = JSON.stringify(jEmailEvent);

        logger.debug('HOOKS:', 'Raw Event: %j', rawEvent);
        queue.addToQueue(emailEvent, (addErr, messageId) => {

            //TODO?: deal with error

            logger.verbose('HOOKS:', 'Message added to the queue');
            next();
        });

    }
};