'use strict';

let throng = require('throng');
let logger = require('winston');

const config = require('./config/config');

logger.level = process.env.LOG_LEVEL || config.logLevel;


throng(start, { workers: 2 }); //TODO: use config or ENV

function start () {

    logger.info('Worker started');

    process.on('SIGTERM', shutdown);

    function shutdown() {
        logger.info('shutting down');
        process.exit();
    }

}
