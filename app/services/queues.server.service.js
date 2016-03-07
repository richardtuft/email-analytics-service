'use strict';

const async = require('async');
const EventEmitter = require('events').EventEmitter;
const Connector = require('./_connector');
const logger = require('../../config/logger');
const eventParser = require('../utils/sparkpostEventParser.server.utils');
const usersListsClient = require('../services/usersListsClient.server.services');
const keen = require('../services/keen.server.service');
const spoor = require('../services/spoor.server.services');

function isHardBounce (e) {
    let action = e.action;
    let bounceClass = e.context.bounceClass;
    return (action === 'bounce' || action === 'out_of_band') &&
      (bounceClass === '10' || bounceClass === '30' || bounceClass === '90');
}

function isGenerationRejection (e) {
    return e.action === 'generation_rejection';
}

class QueueApp extends EventEmitter {

  constructor(config) {
    super();
    this.config = config;
    this.connection = new Connector(config.queueURL);
    this.connection.on('ready', this.onConnected.bind(this));
    this.connection.on('lost', this.onLost.bind(this));
  }

  onConnected() {
    this.connection.defaultChannel().then(channel => {
      //TODO make durable ?
      let ok = channel.assertQueue(this.config.eventQueue);
      ok.then(() => channel.assertQueue(this.config.batchQueue));
      ok.then(() => channel.prefetch(200));
      ok.then(() => {
        this.channel = channel;
        this.emit('ready');
      });
    });
  }

  onLost() {
    logger.error('connection to queue lost');
    this.emit('lost');
  }

  addToQueue(task, queueName) {
    return new Promise((resolve, reject) => {
      this.channel.sendToQueue(queueName, new Buffer(task),
          {persistent: true},
          (err, ok) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
    });
  }

  startConsumingBatches() {
    this.channel.consume(this.config.batchQueue, this.onBatch.bind(this));
  }

  startConsumingEvents() {
    this.channel.consume(this.config.eventQueue, this.onTask.bind(this));
  }

  onBatch(task) {
    let publishEvents = (e, next) => {
      this.addToQueue(JSON.stringify(e), this.config.eventQueue)
        .then(() => next())
        .catch(next);
    };

    let batch = JSON.parse(task.content.toString()).results;
    let q = async.queue(publishEvents, 2000);

    q.drain = () => {
      logger.info('Batch queue drained');
      this.channel.ack(task);
    };

    let count = 0;
    q.push(batch, err => {
      if (err) {
        logger.error(err);
      } else {
        logger.info('count', ++count);
      }
    });

  }

  onTask(task) {
    let e = JSON.parse(task.content.toString());
    delete e.msys.message_event.rcpt_to;
    e = eventParser.parse(e);

    return new Promise((resolve, reject) => {
      let uuid = e.user && e.user.ft_guid;

      //If we have the uuid and it is an hard bounce (or suppressed user) we want to mark the user as suppressed
      if (uuid && (isHardBounce(e) || isGenerationRejection(e))) {

        let toEdit = {
            automaticallySuppressed: true
        };

        return usersListsClient
            .editUser(uuid, toEdit)
            .then(() => resolve(e))
            .catch(reject);

        } else {
            return resolve(e);
        }
      })
      .then(() => {
        return spoor.send(JSON.stringify(e));
      })
      .then(() => {
        // We only send events received in production to keen
        if (process.env.NODE_ENV === 'production') {
          return sendToKeen(e);
        }

        else return e;
      })
      .then(() => {
        return this.channel.ack(task);
      })
      .catch(err => {
        logger.error(err);
        this.channel.nack(task, false, true);
      });
  }
}

module.exports = QueueApp;
