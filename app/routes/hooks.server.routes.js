'use strict';

var hooks = require('../controllers/hooks.server.controller.js');

module.exports = function(app) {
    app.route('/delivered')
        .post(hooks.handlePost);

};