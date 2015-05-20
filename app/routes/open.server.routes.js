'use strict';

var open = require('../controllers/open.server.controller.js');

module.exports = function(app) {
    app.route('/open')
        .post(open.handlePost);

};