'use strict';

// External modules
const logger = require('winston');
const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');

logger.level = process.env.LOG_LEVEL || config.logLevel;

exports.send = (event) => {

    const postUrl = config.spoorPostUrl;

    return fetch(postUrl, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });
};