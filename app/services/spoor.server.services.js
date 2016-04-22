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
        
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': length,
            "spoor-region": Math.round(Math.random()) ? 'EU' : 'US', //Randomly assign a different region
            'User-Agent': 'ft-email-service/v1.1'
        };
        
        if (event.context && event.context.eventId) {
            headers['spoor-ticket'] = event.context.eventId;
        }
        
        if (!isProduction) {
            headers['spoor-test'] =  'true';
        }

        fetch(postUrl, {
            method: 'post',
            headers,
            body: event,
            timeout: 30000
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
