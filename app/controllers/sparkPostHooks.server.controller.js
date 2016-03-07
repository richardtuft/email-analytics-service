'use strict';

// External modules
const eventParser = require('../utils/sparkPostEventParser.server.utils');
const JSONStream = require('JSONStream');
const through = require('through2');
const es = require('event-stream');

// Internal modules
const config = require('../../config/config');
const logger = require('../../config/logger');
const Queue = require('../services/queues.server.service');
const queue = new Queue(config);

const loggerId = 'HOOKS:' + config.processId;

exports.handlePost = (req, res) => {

  logger.profile('handlePost');

  queue.addToQueue(JSON.stringify(req.body), config.batchQueue)
    .then(() => {
      res.send('OK');
    })
    .catch(err => {
      res.status(400);
    });
};
