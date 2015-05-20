'use strict';

exports.handlePost = function(req, res) {
    console.log('POST received:');
    console.log(req.body);
    res.status(200).send('OK');
};