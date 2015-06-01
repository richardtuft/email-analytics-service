'use strict';

// External modules
const logger = require('winston');
const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');

logger.level = config.logLevel;

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

            /* istanbul ignore else */
            if (res.status === 200) {
                fulfill(res);
            }
            else {
                //TODO? what do we do if Spoor is down?
                throw('Spoor responded with the wrong status:' + res.status);
            }

         })
        .catch(reject);
    });


};