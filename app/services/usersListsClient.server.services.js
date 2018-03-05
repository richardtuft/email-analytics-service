'use strict';

const fetch = require('node-fetch');
const config = require('../../config/config');
const logger = require('../../config/logger');

const createUser = user => {
	const body = JSON.stringify(user);
	const contentLength = Buffer.byteLength(body);

	logger.debug('Creating an anon user');

	return fetch(`${config.userListsEndpoint}/users`, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Content-Length': contentLength
		},
		body
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		logger.error('Unexpected response from users-lists API', response.statusText);
		throw new Error(response.statusText);
	});
}

const editUser = (email, editedProperties) => {
	const body = JSON.stringify({
		key: { email },
		user: editedProperties
	});
	const contentLength = Buffer.byteLength(body);

	logger.debug('Editing a user');

	return fetch(`${config.userListsEndpoint}/users/update-one`, {
		method: 'post',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Content-Length': contentLength
		},
		body
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
		const newUser = Object.assign({}, editedProperties, { email });
		return createUser(newUser);
	});
};

const unsubscribeUser = (uuid, listId) => {
	logger.debug('Unsubscribing user', { user: uuid, listId });

	return fetch(`${config.userListsEndpoint}/users/${uuid}/lists/${listId}`, {
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
	});
};

module.exports = {
	editUser,
	unsubscribeUser
}
