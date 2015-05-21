'use strict';

exports.handlePost = function(req, res) {

    let eventParser = require('../utils/eventParser.server.utils');

    let emailEvent = eventParser.parse(req.body);

    console.log('Received ' + emailEvent.type + ' event.');

    res.status(200).send('OK');
};