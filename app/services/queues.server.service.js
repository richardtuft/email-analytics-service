'use strict';

const async = require('async');
const EventEmitter = require('events').EventEmitter;
const Connector = require('./_connector');
const logger = require('../../config/logger');
const eventParser = require('../utils/sparkPostEventParser.server.utils');
const usersListsClient = require('../services/usersListsClient.server.services');
const keen = require('../services/keen.server.service');
const spoor = require('../services/spoor.server.services');

// Event types
const GENERATION_REJECTION = 'generation_rejection';
const SPAM_COMPLAINT = 'spam_complaint';
const LIST_UNSUBSCRIBE = 'list_unsubscribe';
const BOUNCE = 'bounce';

// Categories
const NEWSLETTER = 'newsletter';
const MARKETING = 'marketing';
const ACCOUNT = 'account';
const RECOMMENDATION = 'recommendation';

//field names
const FIELDS = {
  NEWSLETTER: 'suppressedNewsletter',
  RECOMMENDATION: 'suppressedRecommendation',
  MARKETING: 'suppressedMarketing',
  ACCOUNT: 'suppressedAccount'
};

class QueueApp extends EventEmitter {

  constructor(config, prefetch) {
    super();
    this.config = config;
    this.prefetch = prefetch;
    this.connection = new Connector(config.rabbitUrl);
    this.connection.on('ready', this.onConnected.bind(this));
    this.connection.on('lost', this.onLost.bind(this));
    this.connection.on('error', this.onError.bind(this));
  }

  onConnected() {
    let options = { durable: true };
    let ok = this.connection.defaultChannel();
    ok.then(() => this.connection.assertQueue(this.config.eventQueue, options));
    ok.then(() => this.connection.assertQueue(this.config.batchQueue, options));
    ok.then(() => this.connection.setPrefetch(this.prefetch));
    ok.then(() => this.connection.recover());
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

  closeChannel() {
    return this.connection.closeChannel();
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
    let q = async.queue(publishEvents, this.config.batchQueueLimit);

    q.drain = () => {
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
    try {
      e = eventParser.parse(e);
    } catch (e) {
      return this.connection.nack(task);
    }
    return this.sendEvents(e, task);
  }

  sendEvents(event, task) {
    return new Promise((resolve, reject) => {
      let uuid = event.user && event.user.ft_guid;
      let category = context.category;

      //If we have the uuid and it is an hard bounce (or suppressed user) we want to mark the user as suppressed
      const suppressionApplies = category && uuid && (this.isHardBounce(event) || this.isGenerationRejection(event) || this.isSpamComplaint(event) || this.isListUnsubscribe(event));
      if (suppressionApplies) {
        const suppressInAllCategories = this.isHardBounce(event) || this.isGenerationRejection(event);
        return this.sendSuppressionUpdate(event, suppressInAllCategories)
          .then(() => resolve(event))
          .catch(reject);
      }
      logger.debug(JSON.stringify(event));
      return resolve(event);
    })
      .then(() => {
        let eventId = event.context && event.context.eventId;
        return spoor.send(JSON.stringify(event), eventId);
      })
      .then(() => {
        // We only send events received in production to keen
        /* istanbul ignore next */
        if (process.env.NODE_ENV === 'production') {
          return keen.send(event);
        }
        return event;
      })
      .then(() => this.connection.ack(task))
      .catch(err => {
        logger.error(err);
        this.emit('requeuing', { deliveryTag: task.fields.deliveryTag });
        this.connection.nack(task);
      });
  }

  generateReason(event) {
    switch (event.action) {
      case BOUNCE:
        return `BOUNCE: ${event.context.reason || ''}`;

      case SPAM_COMPLAINT:
        return `SPAM COMPLAINT: ${event.context.fbType || ''}`;

      case GENERATION_REJECTION:
        return `GENERATION REJECTION: ${event.context.reason || ''}`;

      case LIST_UNSUBSCRIBE:
        return 'LIST UNSUBSCRIBE';

      default:
        return 'Unknown';
    }

  }


  suppressionTypeByCategory(category) {

    switch (category) {
      case NEWSLETTER:
        return FIELDS.NEWSLETTER;
      case RECOMMENDATION:
        return FIELDS.RECOMMENDATION;
      case MARKETING:
        return FIELDS.MARKETING;
      case ACCOUNT:
        return FIELDS.ACCOUNT;
      default:
        return;
    }
  }

  isHardBounce(e) {
    let action = e.action;
    let bounceClass = e.context.bounceClass;
    return (action === 'bounce' || action === 'out_of_band') &&
      ['10', '30', '90'].indexOf(bounceClass) >= 0;
  }

  isGenerationRejection(e) {
    return e.action === GENERATION_REJECTION;
  }

  isSpamComplaint(e) {
    return e.action === SPAM_COMPLAINT;
  }

  isListUnsubscribe(e) {
    return e.action === LIST_UNSUBSCRIBE;
  }

  sendSuppressionUpdate(event, inAllCategories = false) {

    const {
      user: { ft_guid: uuid },
      context: { category },
      action
    } = event;

    const suppressionType = this.suppressionTypeByCategory(category);
    const reason = this.generateReason(event);

    if (!suppressionType) {
      // Do not suppress
      return Promise.resolve();
    }

    const updateSuppressionsData = inAllCategories ?
      { [suppressionType]: { value: true, reason } } :
      {
        [FIELDS.RECOMMENDATION]: { value: true, reason },
        [FIELDS.NEWSLETTER]: { value: true, reason },
        [FIELDS.MARKETING]: { value: true, reason },
        [FIELDS.ACCOUNT]: { value: true, reason }
      };
    return usersListsClient.editUser(uuid, updateSuppressionsData);
  }
}

module.exports = QueueApp;
