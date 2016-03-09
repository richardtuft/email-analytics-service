'use strict';

function int(str) {
  if (!str) {
    return 0;
  }
  return parseInt(str, 10);
}

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const sqsQueueUrl =  process.env.SQS_QUEUE_URL;
const spoorPostUrl = 'https://spoor-api.ft.com/ingest';
const workers = process.env.WEB_CONCURRENCY || 1;
const rabbitUrl =  process.env.CLOUDAMQP_URL;
const eventQueue = 'events.pending';
const batchQueue = 'batch.pending';
const prefetchLimit = int(process.env.PREFETCH_LIMIT) || 20;
const processId = process.env.DYNO;
const authUser = process.env.AUTH_USER;
const authPassword = process.env.AUTH_PASSWORD;
const userListsEndpoint = process.env.USER_LISTS_ENDPOINT;
const dataConsistencyPostUrl =  'https://di5p505om8.execute-api.eu-west-1.amazonaws.com/dev';

module.exports = {
    port,
    processId,
    workers,
    logLevel,
    rabbitUrl,
    eventQueue,
    batchQueue,
    prefetchLimit,
    spoorPostUrl,
    userListsEndpoint,
    authUser,
    authPassword,
    dataConsistencyPostUrl
};
