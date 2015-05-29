'use strict';

const dotEnv = require('dotenv');
const throng = require('throng');
const logger = require('winston');

try {
    // If we are on a hosted environment we won't probably have a .env file
    dotEnv.load();
}
catch (e) {
    // Do nothing
}

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./config/config');

logger.level = config.logLevel;

throng(start);

function start () {

    logger.info(process.env.NODE_ENV + ' worker started');

    process.on('SIGTERM', shutdown);

    function shutdown() {
        logger.info(process.env.NODE_ENV + ' worker shutting down');
        process.exit();
    }

}
