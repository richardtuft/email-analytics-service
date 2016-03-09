'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const spoorPostUrl = 'https://spoor-api.ft.com/ingest';
const rabbitUrl =  process.env.CLOUDAMQP_URL || 'amqp://localhost';
const eventQueue = 'events.pending';
const batchQueue = 'batch.pending';
const prefetchLimit = process.env.PREFETCH_LIMIT || 20;
const workers = process.env.WEB_CONCURRENCY || 1;
const processId = process.env.DYNO || process.pid;
const authUser = process.env.AUTH_USER;
const authPassword = process.env.AUTH_PASSWORD;
const userListsEndpoint = process.env.USER_LISTS_ENDPOINT || 'http://localhost:1337';
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
