'use strict';

// External Dependencies
const should = require('should');

// Our Modules
const queues = require('../app/services/queues.server.service');
const sqs = require('../config/sqs');
const config = require('../config/config');

// Test constants
const msg = 'A message';
const sqsQueueUrl = config.sqsQueueUrl;

// Test variables
let receiptHandle;

describe('Queues service tests:', () => {

    describe('The addToQueue() method:', () => {

        it('should add a message to the queue', (done) => {

            queues.addToQueue(msg, (addErr) => {
                if (addErr) {
                    done(addErr);
                }

                // Retrieve the message
                sqs.receiveMessage({ QueueUrl: sqsQueueUrl }, (receiveErr, data) => {

                    if (receiveErr) {
                        done(receiveErr);
                    }

                    let message = data.Messages[0];

                    receiptHandle = message.ReceiptHandle;

                    // If the queue contains older messages, we are not going to pull the message we have just sent
                    message.Body.should.be.a.string;

                    done();

                });

            });
        });

        it('should throw an error if the message is not a string', (done) => {

            let wrongMsg = {
                msg: 'A message'
            };

            queues.addToQueue(wrongMsg, (addErr) => {
                addErr.should.be.an.Error;
                done();

            });
        });

        after((done) => {

            //Delete message in the queue
            sqs.deleteMessage({ QueueUrl: sqsQueueUrl,  ReceiptHandle: receiptHandle }, (delErr) => {

                if (delErr) {
                    done(delErr);
                }
                done();

            });

        });

    });

    describe('The pullFromQueue() method:', () => {

        // Add a message to the queue
        before((done) => {

            sqs.sendMessage({
                QueueUrl: sqsQueueUrl,
                MessageBody: msg
            }, (sendErr) => {

                if (sendErr) {
                    done(sendErr);
                }
                done();

            });
        });

        it('should retrieve a message from the queue', (done) => {

            queues.pullFromQueue((pullErr, message) => {
                if (pullErr) {
                    done(pullErr);
                }

                receiptHandle = message.receiptHandle;

                // When testing, we can't be sure that the message we are receiving is the same one we have just sent
                message.body.should.be.a.string;
                message.receiptHandle.should.be.ok;

                done();

            });
        });

        after((done) => {

            //Delete message in the queue
            sqs.deleteMessage({
                QueueUrl: sqsQueueUrl,
                ReceiptHandle: receiptHandle
            }, (delErr) => {

                if (delErr) {
                    done(delErr);
                }
                done();

            });

        });

    });

    describe('The deleteFromQueue() method:', () => {

        beforeEach((done) => {

            // Add a message to the queue
            sqs.sendMessage({
                QueueUrl: sqsQueueUrl,
                MessageBody: msg
            }, (sendErr) => {

                if (sendErr) {
                    done(sendErr);
                }

                // Retrieve the message
                sqs.receiveMessage({ QueueUrl: sqsQueueUrl }, (receiveErr, data) => {

                    if (receiveErr) {
                        done(receiveErr);
                    }
                    let message = data.Messages[0];
                    receiptHandle = message.ReceiptHandle;

                    done();

                });

            });

        });

        it('should delete a message which is in the queue', (done) => {

            queues.deleteFromQueue(receiptHandle, (delErr) => {
                if (delErr) {
                    done(delErr);
                }
                // No error was thrown
                done();


            });

        });

        it('should throw an error if the wrong receiptHandle is provided', (done) => {

            let wrongReceiptHandle = 'wrong';

            queues.deleteFromQueue(wrongReceiptHandle, (delErr) => {
                delErr.should.be.an.Error;
                done();
            });

        });



    });

});