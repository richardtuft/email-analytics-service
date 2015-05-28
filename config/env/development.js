'use strict';

const port = process.env.PORT || 1337;
const logLevel = 'info';
const sqsQueueUrl =  process.env.SQS_QUEUE_URL || '';  //TODO Add default queue

module.exports = {
    port: port,
    logLevel: logLevel,
    sqsQueueUrl: sqsQueueUrl
};