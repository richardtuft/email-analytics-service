'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const sqsQueueUrl =  process.env.SQS_QUEUE_URL;
const spoorPostUrl = 'https://spoor-api.ft.com/ingest';
const workers = process.env.WEB_CONCURRENCY || 1;
const processId = process.env.DYNO;

const userListsEndpoint = process.env.USER_LISTS_ENDPOINT;

module.exports = {
    port: port,
    processId: processId,
    workers: workers,
    logLevel: logLevel,
    sqsQueueUrl: sqsQueueUrl,
    spoorPostUrl: spoorPostUrl,
    userListsEndpoint: userListsEndpoint
};