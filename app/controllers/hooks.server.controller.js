'use strict';

var logger = require('winston');

logger.level = 'debug'; //TODO: Use env/config

exports.handlePost = (req, res) => {

    let eventParser = require('../utils/eventParser.server.utils');

    let eventsArray = req.body;
    eventsArray.map((rawEvent) => {
        logger.debug('Raw Event: ', rawEvent);

        let emailEvent = eventParser.parse(rawEvent);
        logger.info('Received ' + emailEvent.type + ' event.');
    });

    res.status(200).send('OK');
};