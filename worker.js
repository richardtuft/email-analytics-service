'use strict';

let throng = require('throng');
let logger = require('winston');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./config/config');

logger.level = process.env.LOG_LEVEL || config.logLevel;

throng(start, { workers: 2 }); //TODO: use config

function start () {

    logger.info(process.env.NODE_ENV + ' worker started');

    process.on('SIGTERM', shutdown);

    function shutdown() {
        logger.info('shutting down');
        process.exit();
    }

}
