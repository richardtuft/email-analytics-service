'use strict';

require('dotenv').load();
const throng = require('throng');
const logger = require('winston');

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
