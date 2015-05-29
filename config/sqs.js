'use strict';

const aws = require('aws-sdk');

const WaitTimeSeconds = 20;
const VisibilityTimeout = 30;
const region = process.env.SQS_REGION || 'eu-west-1';
const accessKeyId = process.env.SQS_ACCESS_KEY;
const secretAccessKey =  process.env.SQS_SECRET_KEY;

module.exports = new aws.SQS({

    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,

    params: {
        WaitTimeSeconds: WaitTimeSeconds,
        VisibilityTimeout: VisibilityTimeout
    }

});
