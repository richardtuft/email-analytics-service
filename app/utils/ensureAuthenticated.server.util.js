'use strict';

const bAuth = require('basic-auth');
const config = require('../../config/config');


module.exports = (req, res, next) => {
   
    let method = req.headers.authorization && req.headers.authorization.split(' ')[0];

    if (method && method === 'Basic') {
        
        let credentials = bAuth(req);
        
        if (!credentials || credentials.name !== config.authUser || credentials.pass !== config.authPassword) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }

        next();

    } else {
       return res.status(401).send({ message: 'Please make sure your request is authenticated' });
    }

};