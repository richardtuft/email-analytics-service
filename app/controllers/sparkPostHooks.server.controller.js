'use strict';

// External modules
const eventParser = require('../utils/sparkPostEventParser.server.utils');
const JSONStream = require('JSONStream');
const through = require('through2');
const es = require('event-stream');

// Internal modules
const config = require('../../config/config');
const logger = require('../../config/logger');
const Queue = require('../services/queues1.server.service');
const queue = new Queue(config);

const loggerId = 'HOOKS:' + config.processId;

exports.handlePost = (req, res) => {

    logger.profile('handlePost');

    dealWithEvent(req, res);

};

function dealWithEvent (rawEvent, res) {

  rawEvent
    .on('end', () => res.status(200).send('OK'))
    .pipe(JSONStream.parse('results.*'))
    .pipe(es.map((data, cb) => {
      // We do not want to log the email address
      delete data.msys.message_event.rcpt_to;
      eventParser.parse(data);
      queue.addToQueue(JSON.stringify(data))
        .then(() => {
          cb();
        })
        .catch(err => {
          console.log(err)
          cb(err);
        });
    }));
}
