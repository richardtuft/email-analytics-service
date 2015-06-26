'use strict';

const fetch = require('node-fetch');

exports.handle = (req, res) => {

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
                name: "Spoor is UP",
                ok: ok,
                severity: 3,
                businessImpact: 'The messages cannot be sent to Spoor',
                technicalSummary: 'Spoor __gtg responded with the status: ' + status + '. Please check http://spoor-docs.herokuapp.com/#performance',
                panicGuide: 'http://spoor-docs.herokuapp.com/#performance',
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
                message: err
            });
        });

};

function checkSpoor () {
    return new Promise ((fulfill, reject) => {
        fetch('http://spoor-api.ft.com/__gtg')
            .then(res => fulfill(res.status))
            .catch(reject);
    });

}