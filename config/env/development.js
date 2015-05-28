'use strict';

let port = process.env.PORT || 1337;
let logLevel = 'info';
const spoorPostUrl = 'https://spoor-api.ft.com/px.gif';


module.exports = {
    port: port,
    logLevel: logLevel,
    spoorPostUrl: spoorPostUrl
};