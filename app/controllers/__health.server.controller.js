'use strict';

exports.handle = (req, res) => {

    let health = {};

    health.schemaVersion = 1;
    health.name = 'Email Platform Analytics';
    health.description = 'Email Platform Analytics Webhook';
    health.checks = [{ // Random check
        name: "The Application is UP",
        ok: true,
        severity: 3,
        businessImpact: 'Some test text',
        technicalSummary: 'Some test text',
        panicGuide: 'Some test text',
        lastUpdated: Date.now()
    }];

    res.status(200).json(health);
};