'use strict';

const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {

    let app = express();

    //Disable Nagle algorithm
    app.use((req, res, next) => {
        req.connection.setNoDelay(true);
        next();
    });

    app.use(bodyParser.json({
        limit:'20mb'
    }));

    require('../app/routes/__health.server.routes')(app);
    require('../app/routes/__gtg.server.routes')(app);
    require('../app/routes/sparkPostHooks.server.routes')(app);


    app.use(express.static('./public'));

    return app;
};
