'use strict';

// External modules
const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');
const logger = require('../../config/logger');

exports.send = (event) => {

    const postUrl = config.spoorPostUrl;

    return new Promise((fulfill, reject) => {

        let isProduction = process.env.NODE_ENV === 'production';
        let length = new Buffer(event).length;

        fetch(postUrl, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Spoor-Test': !isProduction,
                'Content-Length': length
            },
            body: event,
            timeout: 10000
        })
        .then((res) => {

            /* istanbul ignore else */
            if (res.status >= 200 && res.status < 300) {
                logger.debug('Spoor Header', {header: res.headers.get('spoor-ticket')});
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
