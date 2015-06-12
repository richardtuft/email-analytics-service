'use strict';

const sparkPostHooks = require('../controllers/sparkPostHooks.server.controller');

module.exports = (app) => {
    app.route('/hooks/sparkpost')
        .post(sparkPostHooks.handlePost);
};