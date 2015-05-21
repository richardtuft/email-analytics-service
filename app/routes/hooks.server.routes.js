'use strict';

let hooks = require('../controllers/hooks.server.controller.js');

module.exports = (app) => {
    app.route('/hooks')
        .post(hooks.handlePost);

};