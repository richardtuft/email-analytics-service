'use strict';

exports.init = () => {
    const dsn = process.env.SENTRY_DSN;
    if (dsn) {
        const raven = require('raven');
        return new raven.Client(dsn);
    }
};