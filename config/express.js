'use strict';

const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {

    let app = express();

    app.use(bodyParser.urlencoded({
        extended: true,
        limit:'10mb'
    }));


    app.use(bodyParser.json({
        limit:'10mb'
    }));

    require('../app/routes/hooks.server.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};