'use strict';

function int(str) {
  if (!str) {
    return 0;
  }
  return parseInt(str, 10);
}

const port = process.env.PORT;
const spoorPostUrl = 'https://spoor-api.ft.com/ingest';
const workers = process.env.WEB_CONCURRENCY || 1;
const rabbitUrl =  process.env.CLOUDAMQP_URL;
const eventQueue = 'events.pending';
const batchQueue = 'batch.pending';
const eventPrefetchLimit = int(process.env.EVENT_PREFETCH_LIMIT) || 100;
const batchPrefetchLimit = int(process.env.BATCH_PREFETCH_LIMIT) || 1;
const batchQueueLimit = int(process.env.BATCH_QUEUE_LIMIT) || 100;
const filterTestEvents = process.env.FILTER_TEST_EVENTS || false;
const processId = process.env.DYNO;
const authUser = process.env.AUTH_USER;
const authPassword = process.env.AUTH_PASSWORD;
const userListsEndpoint = process.env.USER_LISTS_ENDPOINT;
const dataConsistencyPostUrl =  'https://di5p505om8.execute-api.eu-west-1.amazonaws.com/dev';
const db = process.env.MONGOHQ_URL;


module.exports = {
    port,
    processId,
    workers,
    rabbitUrl,
    eventQueue,
    batchQueue,
    eventPrefetchLimit,
    batchPrefetchLimit,
    batchQueueLimit,
    filterTestEvents,
    spoorPostUrl,
    userListsEndpoint,
    authUser,
    authPassword,
    dataConsistencyPostUrl,
    db
};
