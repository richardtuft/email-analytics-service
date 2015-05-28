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

    beforeEach(function(done){

        // Purge test queue to make sure that each test is independent
        sqs.purgeQueue({ QueueUrl: sqsQueueUrl }, (purgeErr) => {
            if (purgeErr) {
                done(purgeErr);
            }
            done();
        });
    });

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

                    message.Body.should.match(msg);

                    done();

                });

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

                message.body.should.match(msg);
                message.receiptHandle.should.exist();

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

        before((done) => {

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

        it('should delete message which is in the queue', (done) => {

            queues.deleteFromQueue(receiptHandle, (delErr) => {
                if (delErr) {
                    done(delErr);
                }

                // Retrieve the messages
                sqs.receiveMessage({ QueueUrl: sqsQueueUrl }, (receiveErr, data) => {

                    if (receiveErr) {
                        done(receiveErr);
                    }

                    //There should not be any message in the queue
                    data.Messages.should.not.exist();
                    done();

                });

            });

        });

    });

});