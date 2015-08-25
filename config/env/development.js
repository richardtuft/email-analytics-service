'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const sqsQueueUrl =  process.env.SQS_QUEUE_URL || 'https://sqs.eu-west-1.amazonaws.com/371548805176/email-platform-analytics-dev';
const spoorPostUrl = 'https://spoor-api.ft.com/ingest';
const workers = process.env.WEB_CONCURRENCY || 1;
const processId = process.env.DYNO || process.pid;
const authToken = process.env.AUTH_TOKEN;

const userListsEndpoint = process.env.USER_LISTS_ENDPOINT || 'http://localhost:1337';

module.exports = {
    port: port,
    processId: processId,
    workers: workers,
    logLevel: logLevel,
    sqsQueueUrl: sqsQueueUrl,
    spoorPostUrl: spoorPostUrl,
    userListsEndpoint: userListsEndpoint,
    authToken: authToken
};