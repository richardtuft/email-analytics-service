'use strict';

const logger = require('winston');
const eventParser = require('../utils/eventParser.server.utils');

const config = require('../../config/config');

logger.level = config.logLevel;

exports.handlePost = (req, res) => {

    let eventsArray = req.body;

    eventsArray.map((rawEvent) => {

        logger.debug('Raw Event: ', rawEvent);

        let emailEvent = eventParser.parse(rawEvent);
        logger.info('Received ' + emailEvent.type + ' event.');
    });

    res.status(200).send('OK');
};