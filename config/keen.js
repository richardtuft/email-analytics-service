'use strict';

const Keen = require('keen.io');

const config = require('./config');

const keenClient = Keen.configure({
    projectId: process.env.KEEN_PROJECT_ID, // String (required always)
    writeKey: process.env.KEEN_WRITE_KEY   // String (required for sending data)
});

module.exports = keenClient;

