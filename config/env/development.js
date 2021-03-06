'use strict';

function int(str) {
	if (!str) {
		return 0;
	}
	return parseInt(str, 10);
}

const port = process.env.PORT || 1337;
const spoorPostUrl = 'https://spoor-api.ft.com/ingest';
const rabbitUrl = process.env.CLOUDAMQP_URL || 'amqp://localhost';
const eventQueue = 'events.pending';
const batchQueue = 'batch.pending';
const eventPrefetchLimit = int(process.env.EVENT_PREFETCH_LIMIT) || 100;
const batchPrefetchLimit = int(process.env.BATCH_PREFETCH_LIMIT) || 1;
const batchQueueLimit = int(process.env.BATCH_QUEUE_LIMIT) || 100;
const filterTestEvents = process.env.FILTER_TEST_EVENTS || false;
const workers = process.env.WEB_CONCURRENCY || 1;
const processId = process.env.DYNO || process.pid;
const authUser = process.env.AUTH_USER;
const authPassword = process.env.AUTH_PASSWORD;
const userListsEndpoint = process.env.USER_LISTS_ENDPOINT || 'http://localhost:1337';
const userListsAuthToken = process.env.USER_LISTS_AUTH_TOKEN;
const dataConsistencyPostUrl = 'https://di5p505om8.execute-api.eu-west-1.amazonaws.com/dev';
const db = process.env.MONGOHQ_URL || 'mongodb://localhost/ft-email-analytics-dev';

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
		userListsAuthToken,
		authUser,
		authPassword,
		dataConsistencyPostUrl,
		db
};
