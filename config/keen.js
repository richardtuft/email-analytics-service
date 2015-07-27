'use strict';

const Keen = require('keen-js');

const config = require('./config');

const keenClient = new Keen({
    projectId: process.env.KEEN_PROJECT_ID, // String (required always)
    writeKey: process.env.KEEN_WRITE_KEY   // String (required for sending data)
});

exports.keenClient = keenClient;

