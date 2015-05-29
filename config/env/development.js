'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const sqsQueueUrl =  process.env.SQS_QUEUE_URL || 'https://sqs.eu-west-1.amazonaws.com/371548805176/email-platform-analytics-dev';
const spoorPostUrl = 'https://spoor-api.herokuapp.com/px.gif';

module.exports = {
    port: port,
    logLevel: logLevel,
    sqsQueueUrl: sqsQueueUrl,
    spoorPostUrl: spoorPostUrl
};