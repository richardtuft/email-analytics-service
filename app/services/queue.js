'use strict';

const EventEmitter = require('events').EventEmitter;
const co = require('co');
const sentry = require('../../sentry').init();
const Connector = require('./_connector');
const logger = require('../../logger');

const PENDING_QUEUE = 'jobs.pending';

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
      channel.assertQueue(PENDING_QUEUE);
      this.channel = channel;
      this.emit('ready');
    });
  }

  onLost() {
    logger.info('connection to queue lost');
    this.emit('lost');
  }

  *publishTask(task, productInfo) {
    let listId = task.transmissionHeader.listId;
    let dbResult = yield EmailStatus.addPendingEmail(listId);
    task.productInfo = productInfo;
    task.statusId = dbResult._id;
    return new Promise((resolve, reject) => {
      this.channel.sendToQueue(PENDING_QUEUE, new Buffer(JSON.stringify(task)),
          {persistent: true},
          function(err, ok) {
            if (err) {
              return reject(err);
            }
            resolve(task.statusId);
          });
    });
  }

  startConsuming() {
    this.channel.consume(PENDING_QUEUE, this.onTask.bind(this));
  }

  onTask(task) {
    let email = JSON.parse(task.content.toString());
    let _this = this;
    co(function* () {
      let users = yield userService.fetchByList(email.transmissionHeader.listId);
      yield sendService.sendBatched(users, email);
      yield EmailStatus.updateStatus(email.statusId, 'SENT');
      logger.info('Successfully sent list ' + email.transmissionHeader.listId +
          ' to ' + users.length + ' users');
      _this.channel.ack(task);
    })
    .catch(onError);

    function onError(err) {
      co(function* () {
        logger.error(err);
        yield EmailStatus.updateStatus(email.statusId, 'FAILED');
        _this.channel.ack(task);
				sendToSentry(email);
      }).catch(err => {
        logger.error(err);
        _this.channel.ack(task);
				sendToSentry(email);
      });
    }

    function sendToSentry(email) {
      sentry.captureError('Failed to send email for list: ' +
          email.transmissionHeader.listId);
    }
  }
};

module.exports = QueueApp;
