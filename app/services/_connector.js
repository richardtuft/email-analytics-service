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
          this.connect(queueURL)
        }, 1000);
      });

      logger.info('connected to queue');
      this.conn = conn;
      this.emit('ready');
    }).catch(err => {
      this.emit('lost');
      logger.error(err);
      return setTimeout(() => {
        this.connect(queueURL)
      }, 1000);
    });
  }

  defaultChannel() {
    return this.conn.createConfirmChannel();
  }
}

module.exports = Connector;
