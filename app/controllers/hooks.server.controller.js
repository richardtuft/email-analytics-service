'use strict';

var logger = require('winston');

exports.handlePost = function(req, res) {

    let eventParser = require('../utils/eventParser.server.utils');

    let eventsArray = req.body;
    eventsArray.map((rawEvent) => {
        let emailEvent = eventParser.parse(rawEvent);
        logger.info('Received ' + emailEvent.type + ' event.');
    });

    res.status(200).send('OK');
};