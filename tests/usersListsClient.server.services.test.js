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
                .patch('/users/' + user.uuid)
                .reply(200, responseBodies.successEdit);

            let data = { manuallySuppressed: true };

            let result = usersListsClient.editUser(user.uuid, data);

            result.then((json) => {
                json.should.have.a.property('uuid', responseBodies.successEdit.uuid);
                json.should.have.a.property('email', responseBodies.successEdit.email);
                json.should.have.a.property('firstName', responseBodies.successEdit.firstName);
                json.should.have.a.property('lastName', responseBodies.successEdit.lastName);
                json.should.have.a.property('lists', []);
                done();
            }).catch(done);
        });

        it('should not fail a promise if underlying service returns 404 user not found', (done) => {
            usersListsClientMock
                .patch('/users/' + user.uuid)
                .reply(404, responseBodies.notFound);

            let data = { manuallySuppressed: true };

            let result = usersListsClient.editUser(user.uuid, data);

            result
              .then((json) => {
                json.should.exist; 
                done();
              })
              .catch((err) => done(err));
        });

        it('should fail a promise if underlying service returns a validation error', (done) => {
            usersListsClientMock
                .patch('/users')
                .reply(400, responseBodies.saveError);

            let data = { email: '' };

            let result = usersListsClient.editUser(user.uuid, data);

            result
                .then(() => done(new Error('Call should not succeed.')))
                .catch((err) => done());
        });

    });

});
