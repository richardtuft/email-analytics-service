'use strict';

var processed = require('../controllers/processed.server.controller.js');

module.exports = function(app) {
    app.route('/processed')
        .post(processed.handlePost);

};