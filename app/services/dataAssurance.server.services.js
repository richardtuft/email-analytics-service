'use strict';

// External modules
const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');
const logger = require('../../config/logger');

exports.send = (event) => {

    const postUrl = config.dataConsistencyPostUrl;

    return new Promise((fulfill, reject) => {

        let isProduction = process.env.NODE_ENV === 'production';
        let length = new Buffer(event).length;

        fetch(postUrl, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': length
            },
            body: event
        })
        .then((res) => {

            /* istanbul ignore else */
            if (res.status >= 200 && res.status < 300) {
                fulfill(res);
            }
            else {
                throw('Data-consistency server responded with the wrong status:' + res.status);
            }

         })
        .catch(reject);
    });


};
