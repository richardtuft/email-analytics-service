'use strict';

var hooks = require('../controllers/hooks.server.controller.js');

module.exports = function(app) {
    app.route('/hooks')
        .post(hooks.handlePost);

};