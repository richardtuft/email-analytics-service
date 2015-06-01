'use strict';

// External modules
const logger = require('winston');
const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');

logger.level = config.logLevel;

/* istanbul ignore next */ //TODO: Remove when spoor is up again
exports.send = (event) => {

    const postUrl = config.spoorPostUrl;

    return new Promise((fulfill, reject) => {

        fetch(postUrl, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then((res) => {
            if (res.status === 200) {
                fulfill(res.json());
            }
            else {
                throw('Spoor responded with the wrong status');
            }

         })
        .catch((fetchErr) => {
            reject(fetchErr);
        });
    });


};