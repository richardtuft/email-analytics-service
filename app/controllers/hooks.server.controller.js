'use strict';

exports.handlePost = function(req, res) {

    let eventType = req.body.event;

    console.log('Received ' + eventType + ' event.');

    res.status(200).send('OK');
};