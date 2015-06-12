'use strict';

const sendGridHooks = require('../controllers/sendGridHooks.server.controller');

module.exports = (app) => {
    //TODO: rename Endpoint to reference Sendgrid
    app.route('/hooks/sendgrid')
        .post(sendGridHooks.handlePost);
};