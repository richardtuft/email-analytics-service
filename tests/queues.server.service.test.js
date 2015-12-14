'use strict';

// TODO: mock endpoints

// External Dependencies
const should = require('should');
const Q = require( 'q' );

// Our Modules
const queues = require('../app/services/queues.server.service');
const sqs = require('../config/sqs');
const config = require('../config/config');

// Test constants
const msg = 'A message';
const sqsQueueUrl = config.sqsQueueUrl;

//Use the Q module to create a promise interface for the sqs methods
let sendMessage = Q.nbind(sqs.sendMessage, sqs);
let receiveMessage = Q.nbind(sqs.receiveMessage, sqs);
let deleteMessage = Q.nbind(sqs.deleteMessage, sqs);

// Test variables
let receiptHandle;

describe('Queues service tests:', () => {

    describe('The addToQueue() method:', () => {

        it('should add a message to the queue', (done) => {

            queues.addToQueue(msg)

                .then(() => {
                    return receiveMessage({ QueueUrl: sqsQueueUrl });
                })

                .then((data) => {
                    let message = data.Messages[0];
                    receiptHandle = message.ReceiptHandle;

                    // If the queue contains older messages, we are not going to pull the message we have just sent
                    message.Body.should.be.a.string;

                    done();
                })
                .catch(done);

        });

        it('should throw an error if the message is not a string', (done) => {

            let wrongMsg = {
                msg: 'A message'
            };

            queues.addToQueue(wrongMsg)
                .then(() => {
                    done('We shouldn\'t be here');
                })
                .catch((addErr) => {
                    addErr.should.be.an.Error;
                    done();
                });

        });

        after((done) => {

            //Delete the message added to the queue
            deleteMessage({ QueueUrl: sqsQueueUrl,  ReceiptHandle: receiptHandle })
                .then(() => {
                    done();
                })
                .catch(done);
        });

    });

    describe('The pullFromQueue() method:', () => {

        // Add a message to the queue
        before((done) => {

            sendMessage({ QueueUrl: sqsQueueUrl, MessageBody: msg })
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it('should retrieve an array of messages from the queue', (done) => {

            queues.pullFromQueue()
                .then((messages) => {

                    messages.should.be.an.instanceOf(Array);

                    // When testing, we can't be sure that the message we are receiving is the same one we have just sent
                    messages[0].ReceiptHandle.should.be.ok;

                    done();

                })
                .catch(done);
        });

        after((done) => {

            //Delete the message added to the queue
            deleteMessage({ QueueUrl: sqsQueueUrl,  ReceiptHandle: receiptHandle })
                .then(() => {
                    done();
                })
                .catch(done);

        });

    });

    describe('The deleteFromQueue() method:', () => {

        beforeEach((done) => {

            // Add a message to the queue
            sendMessage({ QueueUrl: sqsQueueUrl, MessageBody: msg })
                .then(() => {
                    // Receive the message
                    return receiveMessage({ QueueUrl: sqsQueueUrl });
                })
                .then((data) => {
                    let message = data.Messages[0];
                    // Set the receiptHandle
                    receiptHandle = message.ReceiptHandle;
                    done();
                })
                .catch(done);

        });

        it('should delete a message which is in the queue', (done) => {

            queues.deleteFromQueue(receiptHandle)
                .then(() => {
                    done();
                })
                .catch(done);

        });

        it('should throw an error if the wrong receiptHandle is provided', (done) => {

            let wrongReceiptHandle = 'wrong';

            queues.deleteFromQueue(wrongReceiptHandle)
                .then(() => {
                    done('We shouldn\'t be here');
                })
                .catch((delErr) => {
                    delErr.should.be.an.Error;
                    done();
                });

        });



    });

});