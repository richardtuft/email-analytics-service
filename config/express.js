'use strict';

const express = require('express');

module.exports = () => {

    let app = express();

    //Disable Nagle algorithm
    app.use((req, res, next) => {
        req.connection.setNoDelay(true);
        next();
    });

    require('../app/routes/__health.server.routes')(app);
    require('../app/routes/__gtg.server.routes')(app);
    require('../app/routes/sparkPostHooks.server.routes')(app);


    app.use(express.static('./public'));

    return app;
};
