'use strict';

// External modules
const logger = require('winston');
const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');

logger.level = config.logLevel;

//TODO: Remove when spoor is up again
/* istanbul ignore next */
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
                //TODO? what do we do if Spoor is down?
                throw('Spoor responded with the wrong status:' + res.status);
            }

         })
        .catch(reject);
    });


};