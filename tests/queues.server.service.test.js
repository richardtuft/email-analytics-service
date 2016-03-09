'use strict';

// TODO: mock endpoints

// External Dependencies
const should = require('should');
const sinon = require('sinon');
const rewire = require('rewire');

// Our Modules
const Queue = rewire('../app/services/queues.server.service');
const Connector = require('../app/services/_connector');
const usersListsClient = require('../app/services/usersListsClient.server.services');
const eventParser = require('../app/utils/sparkPostEventParser.server.utils');
const config = require('../config/config');

// Test constants
const eventsMessage = require('./events/sparkpost/delivery.json');
const hardBounceMessage = require('./events/sparkpost/hardBounce.json');
const hardBounceParsed = eventParser.parse(hardBounceMessage);
const msg = 'A message';

// Test variables
let queues;

// Mocks
let sandbox;

// Helpers
function purgeQueues() {
  return new Promise((resolve, reject) => {
    queues.purgeQueue(config.batchQueue)
      .then(() => queues.purgeQueue(config.eventQueue))
      .then(() => resolve())
      .catch(reject);
  });
}

before(done => {
  sandbox = sinon.sandbox.create();
  queues = new Queue(config);
  queues.once('ready', () => {
    purgeQueues()
      .then(done)
      .catch(done);
  });
});

afterEach(done => {
  sandbox.restore();
  purgeQueues()
    .then(done)
    .catch(done);
});

describe('Queues service tests:', () => {

  describe('The addToQueue() method:', () => {

    it('should add a message to the queue', (done) => {
      Promise.resolve()
        .then(() => queues.addToQueue(msg, config.batchQueue))
        .then(() => queues.countQueueMessages(config.batchQueue))
        .then(count => {
            count.should.be.aboveOrEqual(1);
            done();
        })
        .catch(done);
    });

    it('should throw an error if the message is not a string', (done) => {

        let wrongMsg = {
            msg: 'A message'
        };

        queues.addToQueue(wrongMsg, config.batchQueue)
            .then(() => {
                done('We shouldn\'t be here');
            })
            .catch((addErr) => {
                addErr.should.be.an.Error;
                done();
            });
    });
  });

  describe('Consuming From the queue:', () => {

    beforeEach((done) => {
      Promise.resolve()
        .then(() => {
          return queues.addToQueue(JSON.stringify(eventsMessage), config.batchQueue);
        })
        .then(() => {
          return queues.addToQueue(JSON.stringify(eventsMessage), config.eventQueue);
        })
        .then(() => done())
        .catch(done);
    });

    it('should retrieve a batched message from the batchQueue', (done) => {
      queues.once('processing-task', data => {
        data.should.containEql(config.batchQueue);
        queues.stopConsuming(queues.batchConsumer);
        done();
      });
      queues.startConsumingBatches();
    });

    it('should retrieve an individual message from the eventQueue', (done) => {
      queues.once('processing-task', data => {
        data.should.containEql(config.eventQueue);
        queues.stopConsuming(queues.eventConsumer);
        done();
      });
      queues.startConsumingEvents();
    });

    it.skip('should requeue an event if processing fails', done => {
      queues.once('requeuing', data => {
        should.exist(data.deliveryTag);
        queues.stopConsuming(queues.eventConsumer);
        done();
      });
      queues.startConsumingEvents();
    });

    it('saves the event consumer tag on the instance', done => {
      queues.once('processing-task', data => {
        should.exist(queues.eventConsumer);
        queues.stopConsuming(queues.eventConsumer);
        done();
      });
      queues.startConsumingEvents();
    });

    it('saves the batch consumer tag on the instance', done => {
      queues.once('processing-task', data => {
        should.exist(queues.batchConsumer);
        queues.stopConsuming(queues.batchConsumer);
        done();
      });
      queues.startConsumingBatches();
    });

    it('throws an error if there is a problem processing event', done => {
      queues.sendEvents({bad: 'event'}, {bad: 'task'})
        .then(() => {})
        .catch(err => {
          should.exist(err);
          done();
        });
    });

    it.skip('suppresses user if hard bounce', done => {
      let suppressionStub = sandbox.stub(queues, 'sendSuppressionUpdate')
        .returns(Promise.resolve());
      let ack = sandbox.stub(queues.connection, 'ack').returns(Promise.resolve());

      queues.sendEvents(hardBounceParsed, {task: 'task'})
        .then(() => done('should not be here'))
        .catch(err => {
          should.exist(err);
          done();
        });
    });

    it('send of suppression updates via users lists client', done => {
      let usersListsStub = sandbox.stub(usersListsClient, 'editUser').returns({});
      queues.sendSuppressionUpdate(123);
      usersListsStub.called.should.be.true();
      done();
    });
  });

  describe('Emitting queue events', () => {

    it('emits lost when onLost is called', done => {
      queues.once('lost', () => {
        true.should.be.true();
        done();
      });
      queues.onLost();
    });

    it('emits lost when onError is called', done => {
      queues.once('lost', () => {
        true.should.be.true();
        done();
      });
      queues.onError();
    });
  });

  describe('Connector', () => {

    it('Emits ready when connected', done => {
      let connector = new Connector(config.queueURL);
      connector.once('ready', () => {
        true.should.be.true();
        connector.conn.close();
        done();
      });
    });

    it('disconnects when closeAll is called', done => {
      let connector = new Connector(config.queueURL);
      connector.once('ready', () => {
        connector.once('lost', () => {
          true.should.be.true();
          done();
        });

      connector.closeAll();
      });
    });

    it('Emits "lost" when the connection is closed', done => {
      let connector = new Connector(config.queueURL);
      connector.once('lost', () => {
        true.should.be.true();
        done();
      });
      connector.once('ready', () => {
        connector.conn.close();
      });
    });

    it('Tries to reconnect after 1 second when connection is lost', done => {
      let clock = sandbox.useFakeTimers();
      let connectSpy = sandbox.spy(Connector.prototype, 'connect');
      let connector = new Connector(config.queueURL);
      connector.once('ready', () => {
        connector.conn.once('close', () => {
          clock.tick(1100);
          connectSpy.calledTwice.should.be.true;
          done();
        });
        connector.conn.close();
      });
    });
  });
});
