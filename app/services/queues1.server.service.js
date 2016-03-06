'use strict';

const async = require('async');
const EventEmitter = require('events').EventEmitter;
const Connector = require('./_connector');
const logger = require('../../config/logger');
const eventParser = require('../utils/sparkpostEventParser.server.utils');
const usersListsClient = require('../services/usersListsClient.server.services');
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
      ok.then(() => channel.prefetch(200));
      ok.then(() => {
        this.channel = channel;
        this.emit('ready');
      });
    });
  }

  onLost() {
    logger.info('connection to queue lost');
    this.emit('lost');
  }

  addToQueue(task) {
    return new Promise((resolve, reject) => {
      this.channel.sendToQueue(this.config.eventQueue, new Buffer(task),
          {persistent: true},
          (err, ok) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
    });
  }

  startConsuming() {
    this.channel.consume(this.config.eventsQueue, this.onTask.bind(this));
  }

  //onTask(task) {
    //let evnt = JSON.parse(task.content.toString());
    //setTimeout(() => {
      //console.log('hi');
      //this.channel.ack(task);
    //}, 1000);
  //}

  onTask(task) {
    let evnt = JSON.parse(task.content.toString());
    return new Promise((resolve, reject) => {
      let uuid = evnt.user && evnt.user.ft_guid;

      //If we have the uuid and it is an hard bounce (or suppressed user) we want to mark the user as suppressed
      if (uuid && (isHardBounce(event) || isGenerationRejection(event))) {

        let toEdit = {
            automaticallySuppressed: true
        };

        return usersListsClient
            .editUser(uuid, toEdit)
            .then(() => resolve(evnt))
            .catch(reject);

        } else {
            return resolve(evnt);
        }
      })
      .then((evnt) => {
        // We only send events received in production to keen
        if (process.env.NODE_ENV === 'production') {
          return sendToKeen(evnt);
        }

        else return evnt;
      })
      .then((e) => {
        return spoor.send(JSON.stringify(evnt));
      })
      .then(() => {
        return this.channel.ack(task);
      })
      .catch(err => {
        console.log(err);
        this.channel.nack(task, false, true);
      });
  }
};

module.exports = QueueApp;
