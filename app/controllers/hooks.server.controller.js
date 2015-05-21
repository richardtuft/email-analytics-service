'use strict';

exports.handlePost = function(req, res) {

    let parseEvent = require('../utils/eventParser.server.utils');

    let emailEvent = parseEvent.parse(req.body);

    console.log('Received ' + emailEvent.type + ' event.');

    res.status(200).send('OK');
};