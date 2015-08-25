'use strict';

const sparkPostHooks = require('../controllers/sparkPostHooks.server.controller');
const ensureAuthenticated = require('../utils/ensureAuthenticated.server.util');

module.exports = (app) => {
    app.route('/hooks/sparkpost')
        .post(ensureAuthenticated, sparkPostHooks.handlePost);
};