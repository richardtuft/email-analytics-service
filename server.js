'use strict';

// External modules
require('dotenv').load({silent: true});
const logger = require('winston');
const memwatch = require('memwatch-next'); //TODO: Remove in production


//TODO: Remove in production
let hd; //HeapDiff

//TODO: Remove in production
/* istanbul ignore next */
memwatch.on('stats', function(stats) {
    console.error('Server GC:');
    console.error(stats);

    if (!hd) {
        hd = new memwatch.HeapDiff();
    } else {
        let diff = hd.end();
        console.error(diff.change.details);
        hd = null;
    }
});

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const express = require('./config/express');

/* istanbul ignore next */
logger.level = process.env.LOG_LEVEL || config.logLevel;

let app = express();

app.listen(config.port);

module.exports = app;

logger.info('SERVER.JS:', process.env.NODE_ENV + ' server running at http://localhost:' + config.port);