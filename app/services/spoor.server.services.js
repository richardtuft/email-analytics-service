'use strict';

// External modules
const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');

exports.send = (event) => {

    const postUrl = config.spoorPostUrl;

    return new Promise((fulfill, reject) => {

        let isProduction = process.env.NODE_ENV === 'production';

        fetch(postUrl, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Spoor-Test': !isProduction
            },
            body: JSON.stringify(event)
        })
        .then((res) => {

            /* istanbul ignore else */
            if (res.status >= 200 && res.status < 300) {
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