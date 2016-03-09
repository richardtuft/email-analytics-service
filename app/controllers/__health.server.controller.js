'use strict';

const fetch = require('node-fetch');
const config = require('../../config/config');

module.exports = (queue) => {

  function handle(req, res) {
    let health = {};
    let now = new Date();

    health.schemaVersion = 1;
    health.name = 'Email Platform Analytics';
    health.description = 'Email Platform Analytics Webhook';
    health.checks = [];

    checkSpoor()
        .then(status => {

            let ok = (status === 200);

            health.checks.push({
                name: "Spoor is DOWN",
                ok: ok,
                severity: 3,
                businessImpact: 'The messages cannot be sent to Spoor',
                technicalSummary: 'Spoor __gtg responded with the status: ' + status + '. Please check http://spoor-docs.herokuapp.com/#performance',
                panicGuide: 'http://spoor-docs.herokuapp.com/#performance',
                lastUpdated: now.toISOString()
            });

            return health;

        })
        .then(() => {
            return queue.countAllMessages(config.eventQueue);
        })
        .then(data => {
            
            let isUp = (data && data.eventQueue >=0 && data.batchQueue >= 0);
            let hasFewMessages = (data.eventQueue < 1000000 && data.batchQueue < 100000);

            health.checks.push({
                name: "AWS SQS is DOWN",
                ok: isUp,
                severity: 2,
                businessImpact: 'The analytics event will be lost',
                technicalSummary: 'AWS SQS could be down. It does not respond correctly',
                panicGuide: 'The AWS SQS queue should be restored',
                lastUpdated: now.toISOString()
            });

            health.checks.push({
                name: "AWS SQS is filling up",
                ok: hasFewMessages,
                severity: 3,
                businessImpact: 'The queue is not being processed fast enough',
                technicalSummary: 'AWS SQS queue is getting longer and longer',
                panicGuide: 'Add more workers to process the queue',
                lastUpdated: now.toISOString()
            });

            return health;
        })
        .then(health => {
            return res.status(200).json(health);
        })
        .catch(err => {
            /* istanbul ignore next */
            return res.status(400).send({
                message: err.message
            });
        });

  }

  function checkSpoor () {
      return new Promise ((fulfill, reject) => {
          fetch('https://spoor-api.ft.com/__gtg')
              .then(res => fulfill(res.status))
              .catch(err => reject(err));
      });

  }

  return {
    handle
  };
};
