'use strict';

const gtg = require('../controllers/__health.server.controller');

module.exports = (app) => {

    app.route('/__health').get(gtg.handle);
};