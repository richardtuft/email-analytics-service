'use strict';

// External modules
const eventParser = require('../utils/sparkPostEventParser.server.utils');
const JSONStream = require('JSONStream');
const through = require('through2');
const es = require('event-stream');
const mongoose = require('mongoose');


// Internal modules
const config = require('../../config/config');
const logger = require('../../config/logger');


// Models
const Batch = mongoose.model('Batch');

const loggerId = 'HOOKS:' + config.processId;

module.exports = (queue) => {

    return (req, res) => {

        res.send('OK');
        
        console.debug(req.headers['X-Messagesystems-Batch-Id'])

        let batch = new Batch({ batchId: req.headers['X-Messagesystems-Batch-Id'] });

        batch.save((saveErr) => {

            if (!saveErr) {

                queue.addToQueue(JSON.stringify(req.body), config.batchQueue)
                    .catch(err => {
                        logger.error(err);
                    });
            } else {
                logger.error(saveErr)
            }

        });

    };

};
