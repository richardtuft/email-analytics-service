'use strict';

const logger = require('winston');
const eventParser = require('../utils/eventParser.server.utils');

exports.handlePost = (req, res) => {

    let eventsArray = req.body;

    eventsArray.map((rawEvent) => {
        let emailEvent = eventParser.parse(rawEvent);
        logger.info('Received ' + emailEvent.type + ' event.');
    });

    res.status(200).send('OK');
};