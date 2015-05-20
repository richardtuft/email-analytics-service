'use strict';

var delivered = require('../controllers/delivered.server.controller.js');

module.exports = function(app) {
    app.route('/delivered')
        .post(delivered.handlePost);

};