'use strict';

var deferred = require('../controllers/deferred.server.controller.js');

module.exports = function(app) {
    app.route('/deferred')
        .post(deferred.handlePost);

};