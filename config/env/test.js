'use strict';

let port = process.env.PORT || 1338;
let logLevel = 'warn';
const spoorPostUrl = 'https://spoor-api.ft.com/px.gif';

module.exports = {
    port: port,
    logLevel: logLevel
};