'use strict';

var click = require('../controllers/click.server.controller.js');

module.exports = function(app) {
    app.route('/click')
        .post(click.handlePost);

};