'use strict';

let aws = require('aws-sdk');

module.exports = () => {

    return new aws.SQS({
        region: process.env.SQS_REGION || 'eu-west-1', //TODO: use config for default
        accessKeyId: process.env.SQS_ACCESS_KEY,
        secretAccessKey: process.env.SQS_SECRET_KEY
    });

};