'use strict';


exports.send = (event) => {
		const keenClient = require('../../config/keen');
    return new Promise((fullfill, reject) => {
        keenClient.addEvent('events', event, (err, res) => {

            if (err) {
                return reject(err);
            }

            return fullfill(res);

        });
    });
};
