'use strict';

// External modules
const eventParser = require('../utils/sparkPostEventParser.server.utils');
const JSONStream = require('JSONStream');
const through = require('through2');
const es = require('event-stream');

// Internal modules
const config = require('../../config/config');
const logger = require('../../config/logger');

const loggerId = 'HOOKS:' + config.processId;

module.exports = (queue) => {
  
  function handlePost(req, res) {

    res.send('OK');

    queue.addToQueue(JSON.stringify(req.body), config.batchQueue)
      .catch(err => {
        logger.error(err);
      });
  }

  return {
    handlePost
  };
};
