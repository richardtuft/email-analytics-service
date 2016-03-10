'use strict';

const amqplib = require('amqplib');
const EventEmitter = require('events').EventEmitter;
const logger = require('../../config/logger');

class Connector extends EventEmitter {

  constructor(queueURL) {
    super();
    this.connect(queueURL);
  }

  connect(queueURL) {
    return amqplib.connect(queueURL).then(conn => {
      conn.on('error', (err) => {
        logger.error(err);
      });

      conn.on('close', () => {
        this.emit('lost');
        return setTimeout(() => {
          this.connect(queueURL);
        }, 1000);
      });

      logger.info('connected to queue');
      this.conn = conn;
      this.emit('ready');
    }).catch(err => {
      this.emit('lost');
      logger.error(err);
      return setTimeout(() => {
        this.connect(queueURL);
      }, 1000);
    });
  }

  defaultChannel() {
    return new Promise((resolve, reject) => {
      this.conn.createConfirmChannel()
        .then(channel => {
          this.channel = channel;
          resolve();
        })
        .catch(reject);
    });
  }

	assertQueue(queue) {
   return this.channel.assertQueue(queue);
  }

  setPrefetch(amount) {
    return this.channel.prefetch(amount);
  }

  sendToQueue(task, queueName) {
    return new Promise((resolve, reject) => {
      this.channel.sendToQueue(queueName, new Buffer(task), {}, (err, ok) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
    });
  }

  consume(queueName, cb) {
    return this.channel.consume(queueName, cb);
  }

  cancel(consumerTag) {
    if (consumerTag) {
      this.channel.cancel(consumerTag);
    }
  }

  ack(task) {
    return this.channel.ack(task);
  }

  nack(task) {
    return this.channel.nack(task);
  }

  countMessages(queueName) {
    return new Promise((resolve, reject) => {
      this.channel.checkQueue(queueName)
        .then(details => {
          resolve(details.messageCount);
        })
        .catch(reject);
    });
  }

  closeChannel() {
    return this.channel.close();
  }

  closeConnection() {
    return this.conn.close();
  }

  closeAll() {
    return new Promise((resolve, reject) => {
      this.closeChannel()
        .then(() => this.closeConnection())
        .then(() => resolve())
        .catch(() => resolve());
    });
  }

  nackAll() {
    return new Promise((resolve, reject) => {
      this.channel.nackAll()
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  purgeQueue(queueName) {
    return this.channel.purgeQueue(queueName);
  }
}

module.exports = Connector;
