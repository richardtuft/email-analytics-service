'use strict';

const controller = require('../controllers/__health.server.controller');

module.exports = (app, queue) => {
  let gtg = controller(queue);
  app.route('/__health').get(gtg.handle);
};
