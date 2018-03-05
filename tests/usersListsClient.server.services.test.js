'use strict';

const usersListsClient = require('../app/services/usersListsClient.server.services');
const config = require('../config/config');
const should = require('should');
const nock = require('nock');


describe('The usersListsClient service', () =>{

	let usersListsClientMock = nock(config.userListsEndpoint);

	let user;

	let responseBodies = {
		successEdit: { "uuid":"aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee","email":"email@email.com","firstName":"First","lastName":"Last","lists":[], "manuallySuppressed": true},
		notFound: { "message": "User Not Found"},
		saveError: {"message": "uuid cannot be blank"}
	};

	beforeEach(() => {
		user = {"uuid":"aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee","email":"email@email.com","firstName":"First","lastName":"Last", "manuallySuppressed": false};

		usersListsClientMock
			.defaultReplyHeaders({
				'Content-Type':'application/json'
			});
	});

	afterEach(() => {
		nock.cleanAll();
	});

	describe('The editUser method', () => {

		it('should fulfil a promise providing a user object when the underlying service succeeds', (done) => {
			usersListsClientMock
				.post('/users/update-one')
				.reply(200, responseBodies.successEdit);

			let data = { manuallySuppressed: true };

			let result = usersListsClient.editUser(user.email, data);

			result.then((json) => {
				json.should.have.a.property('uuid', responseBodies.successEdit.uuid);
				json.should.have.a.property('email', responseBodies.successEdit.email);
				json.should.have.a.property('firstName', responseBodies.successEdit.firstName);
				json.should.have.a.property('lastName', responseBodies.successEdit.lastName);
				json.should.have.a.property('lists', []);
				done();
			}).catch(done);
		});

		it('should create a user if Not Found response when editing', (done) => {
			usersListsClientMock
				.post('/users/update-one')
				.reply(404, responseBodies.notFound);

			usersListsClientMock
				.post('/users')
				.reply(200, responseBodies.successEdit);

			let data = { manuallySuppressed: true };

			let result = usersListsClient.editUser(user.email, data);

			result
				.then((json) => {
					json.should.exist;
					done();
				})
				.catch((err) => done(err));
		});

		it('should fail a promise if underlying service returns a validation error', (done) => {
			usersListsClientMock
				.post('/users/update-one')
				.reply(400, responseBodies.saveError);

			let data = { email: '' };

			let result = usersListsClient.editUser(user.email, data);

			result
				.then(() => done(new Error('Call should not succeed.')))
				.catch((err) => done());
		});

	});

	describe('The unsubscribe method', () => {

		it('should fulfil a promise when the underlying service succeeds', (done) => {
			const listId = 123;
			usersListsClientMock
				.delete('/users/' + user.uuid + '/lists/' + listId)
				.reply(200, responseBodies.successEdit);

			usersListsClient.unsubscribe(user.uuid, listId)
				.then(json => {
					json.should.have.a.property('uuid', responseBodies.successEdit.uuid);
					done();
				}).catch(done);
		});

		it('should not fail a promise if underlying service returns 404 user not found', (done) => {
			const listId = 'notexist';
			usersListsClientMock
				.delete('/users/' + user.uuid + '/lists/' + listId)
				.reply(404, responseBodies.notFound);

			usersListsClient.unsubscribe(user.uuid, listId)
				.then(json => {
					json.should.exist;
					done();
				})
				.catch((err) => done(err));
		});

		it('should fail a promise if underlying service returns a validation error', (done) => {
			const listId = '1234';
			usersListsClientMock
				.delete('/users/' + user.uuid + '/lists/' + listId)
				.reply(400, responseBodies.notFound);

			usersListsClient.unsubscribe(user.uuid, listId)
				.then(() => done(new Error('Call should not succeed.')))
				.catch((err) => done());
		});

	});

});
