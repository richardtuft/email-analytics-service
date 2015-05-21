'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let config = require('./config/config');
let express = require('./config/express');

let app = express();

app.listen(config.port);

module.exports = app;

console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);