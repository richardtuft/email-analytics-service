'use strict';

const gtg = require('../controllers/__gtg.server.controller');

module.exports = (app) => {

    app.route('/__gtg').get(gtg.handle);
};