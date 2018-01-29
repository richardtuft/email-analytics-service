'use strict';

// External modules
const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');
const logger = require('../../config/logger');

exports.send = (event, eventId) => {

  // we currently send to scout and ftcom orgs on spoor
  const scout = event.context.product && event.context.product.includes('scout');
  const postUrl = scout ? `${config.spoorPostUrl}?org=scout` : config.spoorPostUrl;

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

    if (eventId) {
      headers['spoor-ticket'] = 'email-analytics-' + eventId;
    }

    if (!isProduction) {
      headers['spoor-test'] =  'true';
    }

    fetch(postUrl, {
      method: 'post',
      headers,
      body: event
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
