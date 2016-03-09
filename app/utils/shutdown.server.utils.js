'use strict';

// Internal modules
const logger = require('../../config/logger');

/* istanbul ignore next */
module.exports = (loggerId, queue) => {
    logger.info(loggerId,  process.env.NODE_ENV + ' shutting down');
    let ok = queue.connection.nackAll();
    ok.then(() => queue.closeAll());
    ok.then(() => process.exit());
    ok.catch(err => process.exit());
};
