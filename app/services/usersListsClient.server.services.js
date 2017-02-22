'use strict';

// External modules

const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');
const logger = require('../../config/logger');

const loggerId = 'SERVER:' + config.processId;

function createUser(user) {

  return new Promise((fulfill, reject) => {
    let body = JSON.stringify(user);
    let contentLength = Buffer.byteLength(body);

    logger.debug('Creating an anon user');

    fetch(config.userListsEndpoint + '/users', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': contentLength
      },
      body: body
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      logger.error('Unexpected response from users-lists API', response.statusText);
      throw new Error(response.statusText);
    })
    .then(fulfill)
    .catch(reject);
  });
}

exports.editUser = (email, editedProperties) => {

  return new Promise((fulfill, reject) => {

    let body = JSON.stringify({
      key: {
        email: email
      },
      user: editedProperties
    });
    let contentLength = Buffer.byteLength(body);

    logger.debug('Editing a user');

    fetch(config.userListsEndpoint + '/users/update-one', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': contentLength
      },
      body: body
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      if (response.status !== 404) {
        //We received a status we do not accept
        logger.error('Unexpected response from users-lists API', response.statusText);
        throw new Error(response.statusText);
      }
      console.log('here');
      const newUser = Object.assign({}, editedProperties, {email: email});
      return createUser(newUser)
        .then(usr => {
          return usr;
        })
    })
    .then(fulfill)
    .catch(reject);
  });
};

exports.unsubscribe = (uuid, listId) => {

  return new Promise((fulfill, reject) => {

    logger.debug('Unsubscribing user', {user: uuid, listId});

    fetch(config.userListsEndpoint + '/users/' + uuid + '/lists/' + listId, {
      method: 'delete',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      if (response.status !== 404) {
        //We received a status we do not accept
        logger.error('Unexpected response from users-lists API', response);
        throw new Error(response.statusText);
      }
      return Promise.resolve({});
    })
    .then(fulfill)
    .catch(reject);
  });
};
