'use strict';

// External modules

const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');
const logger = require('../../config/logger');

const loggerId = 'SERVER:' + config.processId;

exports.editUser = (uuid, editedProperties) => {

    return new Promise((fulfill, reject) => {

        let body = JSON.stringify(editedProperties);
        let contentLength = Buffer.byteLength(body);

        logger.debug('Editing a user', {user: uuid, body: body, contentLength: contentLength });
        console.log(config.userListsEndpoint)

        fetch(config.userListsEndpoint + '/users/' + uuid, {
            method: 'patch',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': contentLength
            },
            body: body
        })
            .then(response => {
              console.log(response.status)
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                if (response.status !== 404) {
                    //We received a status we do not accept
                    logger.error('Unexpected response from users-lists API', response);
                }
                throw new Error(response.statusText);
            })
            .then(fulfill)
            .catch(reject);
    });
};
