'use strict';

const controller = require('../controllers/sparkPostHooks.server.controller');
const ensureAuthenticated = require('../utils/ensureAuthenticated.server.util');

module.exports = (app, queue) => {
    let sparkPostHooks = controller(queue);
    app.route('/hooks/sparkpost')
        .post(ensureAuthenticated, sparkPostHooks.handlePost);
};
