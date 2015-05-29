'use strict';

// Our modules
const sqs = require('../../config/sqs');
const config = require('../../config/config');

// External modules
const Q = require( 'q' );
const logger = require('winston');

// Constants
const queueUrl = config.sqsQueueUrl;

/**
 * addToQueue()
 * @param message String the message to add to the queue
 * @param next function callback(onErr, onSuccess)
 */
exports.addToQueue = (message, next) => {
    let sendMessage = Q.nbind( sqs.sendMessage, sqs ); //Use the Q module to create a promise interface for the sqs methods

    sendMessage({
        QueueUrl: queueUrl,
        MessageBody: message
    })
    .then((data) => {

        let messageId = data.MessageId;

        /* istanbul ignore else  */
        if (next) {
            next(null, messageId);
        }

    })
    .catch ((error) => {

        /* istanbul ignore else  */
        if (next) {
            next(error);
        }
    });

};


/**
 * pullFromQueue()
 * @param next function callback(onErr, onSuccess). OnSuccess will receive a message object with two properties:
 *  - message.body: the body of the message
 *  - message.receiptHandle: an id to be used to delete the message from the queue
 */
exports.pullFromQueue = (next) => {
    let receiveMessage = Q.nbind( sqs.receiveMessage, sqs ); //Use the Q module to create a promise interface for the sqs methods

    receiveMessage ({
        QueueUrl: queueUrl
    })
    .then((data) => {

        /* istanbul ignore next  */
        if (!data.Messages) {
            next();
        }
        else {
            /* istanbul ignore else  */
            if (next) {
                next(null, {
                    body: data.Messages[0].Body,
                    receiptHandle: data.Messages[0].ReceiptHandle
                });
            }
        }

    })
    .catch ((error) => {
        /* istanbul ignore next  */
        if (next) {
            next(error);
        }

    });

};

/**
 * deleteFromQueue
 * @param receiptHandle String An identifier for a received message
 * @param next function callback(onErr, onSuccess)
 */
exports.deleteFromQueue = (receiptHandle, next) => {

    let deleteMessage = Q.nbind( sqs.deleteMessage, sqs ); //Use the Q module to create a promise interface for the sqs methods

    deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
    })
    .then(() => {

        /* istanbul ignore else  */
        if (next) {
            next();
        }
    })
    .catch ((error) => {

        /* istanbul ignore else  */
        if (next) {
            next(error);
        }

    });

};