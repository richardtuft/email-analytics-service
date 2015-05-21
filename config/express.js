'use strict';

let express = require('express'),
    bodyParser = require('body-parser');

module.exports = function() {

    let app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    require('../app/routes/hooks.server.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};