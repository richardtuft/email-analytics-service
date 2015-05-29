'use strict';

const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {

    let app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));


    app.use(bodyParser.json({
        limit: 1024 * 1024 * 2 //2MB
    }));

    require('../app/routes/hooks.server.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};