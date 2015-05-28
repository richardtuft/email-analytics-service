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
        logger.info('Message sent: ', data.MessageId);

        if (next) {
            next();
        }
    })
    .catch ((error) => {

        logger.error(error);

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

        if (!data.Messages) {
            throw(new Error( 'There are no messages to process.' ));
        }

        logger.info('Retrieved ' + data.Messages[0].Body  + ' from the queue.');

        if (next) {
            next(null, {
                body: data.Messages[0].Body,
                receiptHandle: data.Messages[0].ReceiptHandle
            });
        }

    })
    .catch ((error) => {

        logger.error(error);

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
            logger.info(( "Message " + receiptHandle + " deleted from queue!" ));

        if (next) {
            next();
        }

    })
    .catch ((error) => {

        logger.error(error);

        if (next) {
            next(error);
        }

    });

};