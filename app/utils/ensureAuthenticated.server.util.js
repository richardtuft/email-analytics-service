'use strict';

const config = require('../../config/config');


module.exports = (req, res, next) => {

    if (!req.headers['x-messagesystems-webhook-token']) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }

    let token = req.headers['x-messagesystems-webhook-token'];

    if (token !== config.authToken) {
        return res.status(401).send({ message: 'Invalid Auth Token' });
    }
    next();
};