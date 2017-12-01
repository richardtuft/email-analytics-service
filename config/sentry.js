'use strict';

exports.init = () => {
    const dsn = process.env.SENTRY_DSN;
    if (dsn) {
        const raven = require('raven');
        let client =  new raven.Client(dsn);
        return client.patchGlobal();
    }
};
