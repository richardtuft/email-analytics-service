'use strict';

const async = require('async');
const EventEmitter = require('events').EventEmitter;
const Connector = require('./_connector');
const logger = require('../../config/logger');
const eventParser = require('../utils/sparkPostEventParser.server.utils');
const usersListsClient = require('../services/usersListsClient.server.services');
const keen = require('../services/keen.server.service');
const spoor = require('../services/spoor.server.services');

function isHardBounce (e) {
    let action = e.action;
    let bounceClass = e.context.bounceClass;
    return (action === 'bounce' || action === 'out_of_band') &&
      ['10', '30', '90'].indexOf(bounceClass) >= 0;
}

function isGenerationRejection (e) {
    return e.action === 'generation_rejection';
}

class QueueApp extends EventEmitter {

  constructor(config) {
    super();
    this.config = config;
    this.connection = new Connector(config.rabbitUrl);
    this.connection.on('ready', this.onConnected.bind(this));
    this.connection.on('lost', this.onLost.bind(this));
    this.connection.on('error', this.onError.bind(this));
  }

  onConnected() {
    let ok = this.connection.defaultChannel();
    ok.then(() => this.connection.assertQueue(this.config.eventQueue));
    ok.then(() => this.connection.assertQueue(this.config.batchQueue));
    ok.then(() => this.connection.setPrefetch(this.config.prefetchLimit));
    ok.then(() => this.emit('ready'));
    ok.catch(this.onError);
  }

  onLost() {
    logger.info('connection to queue lost');
    this.emit('lost');
  }

  onError() {
    logger.error('error with queue connection');
    this.emit('lost');
  }

  addToQueue(task, queueName) {
    return this.connection.sendToQueue(task, queueName);
  }

  countQueueMessages(queueName) {
    return this.connection.countMessages(queueName);
  }

  countAllMessages() {
    let queueCount = {};
    return new Promise((resolve, reject) => {
      this.countQueueMessages(this.config.eventQueue)
        .then(eventCount => {
          queueCount.eventQueue = eventCount;
          return this.countQueueMessages(this.config.batchQueue);
        })
        .then(batchCount => {
          queueCount.batchQueue = batchCount;
          resolve(queueCount);
        })
        .catch(reject);
    });
  }

  closeAll() {
    return this.connection.closeAll();
  }

  purgeQueue(queueName) {
    return this.connection.purgeQueue(queueName);
  }

  startConsumingBatches() {
    this.connection.consume(this.config.batchQueue, this.onBatch.bind(this));
  }

  startConsumingEvents() {
    this.connection.consume(this.config.eventQueue, this.onTask.bind(this));
  }

  stopConsuming(consumerTag) {
    this.connection.cancel(consumerTag);
  }

  onBatch(task) {
    if (!this.batchConsumer) {
      this.batchConsumer = task.fields.consumerTag;
    }
    this.emit('processing-task', 'queue: ' + task.fields.routingKey);
    let publishEvents = (e, next) => {
      this.addToQueue(JSON.stringify(e), this.config.eventQueue)
        .then(() => next())
        .catch(next);
    };

    let batch = JSON.parse(task.content.toString());
    let q = async.queue(publishEvents, 2000);

    q.drain = () => {
      logger.info('Batch queue drained');
      this.connection.ack(task);
    };

    q.push(batch, err => {
      if (err) {
        logger.error(err);
      } else {
        //logger.info('count', ++count);
      }
    });

  }

  onTask(task) {
    if (!this.eventConsumer) {
      this.eventConsumer = task.fields.consumerTag;
    }
    this.emit('processing-task', 'queue: ' + task.fields.routingKey);
    let e = JSON.parse(task.content.toString());
    console.log(e)
    delete e.msys.message_event.rcpt_to;
    e = eventParser.parse(e);
    return this.sendEvents(e, task);
  }

  sendEvents(e, task) {
    return new Promise((resolve, reject) => {
      let uuid = e.user && e.user.ft_guid;
      //If we have the uuid and it is an hard bounce (or suppressed user) we want to mark the user as suppressed
      if (uuid && (isHardBounce(e) || isGenerationRejection(e))) {
        return this.sendSuppressionUpdate(uuid);
      }
      return resolve(e);
    })
    .then(() => spoor.send(JSON.stringify(e)))
    .then(() => {
      // We only send events received in production to keen
      /* istanbul ignore next */
      if (process.env.NODE_ENV === 'production') {
        return keen.send(e);
      }
      return e;
    })
    .then(() => this.connection.ack(task))
    .catch(err => {
      logger.error(err);
      this.emit('requeuing', {deliveryTag: task.fields.deliveryTag});
      this.connection.nack(task, false, true);
    });
  }

  sendSuppressionUpdate(uuid) {
    let toEdit = {
        automaticallySuppressed: true
    };
    return usersListsClient.editUser(uuid, toEdit);
  }
}

module.exports = QueueApp;
