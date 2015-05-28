'use strict';

const port = process.env.PORT || 1338;
const logLevel = process.env.LOG_LEVEL || 'warn';
const sqsQueueUrl =  process.env.SQS_QUEUE_URL || '';  //TODO Add default queue


module.exports = {
    port: port,
    logLevel: logLevel,
    sqsQueueUrl: sqsQueueUrl
};