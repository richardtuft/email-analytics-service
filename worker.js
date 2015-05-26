'use strict';

let throng = require('throng');
let logger = require('winston');


throng(start, { workers: 2 }); //TODO: use config or ENV

function start () {

    logger.info(process.env.NODE_ENV  + ' worker started');

    process.on('SIGTERM', shutdown);

    function shutdown() {
        logger.log({ type: 'info', msg: 'shutting down' });
        process.exit();
    }

}
