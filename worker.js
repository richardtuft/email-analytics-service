'use strict';

let throng = require('throng');
let logger = require('winston');


throng(start, { workers: 2 }); //TODO: use config or ENV

function start () {

    logger.info('Worker started');

    process.on('SIGTERM', shutdown);

    function shutdown() {
        logger.info('shutting down');
        process.exit();
    }

}
