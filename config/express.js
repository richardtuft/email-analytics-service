'use strict';

const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {

    let app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    require('../app/routes/hooks.server.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};