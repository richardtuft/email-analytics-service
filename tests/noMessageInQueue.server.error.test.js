'use strict';

// External dependencies
const should = require('should');

// Internal module
const NoMessageInQueueError = require('../app/errors/noMessageInQueue.server.error');

describe('The NoMessageInQueueError error', () => {

    it('has the correct error name', (done) => {
        let error = new NoMessageInQueueError();
        error.name.should.match('NoMessageInQueueError');
        done();
    });

    it('has the correct error message', (done) => {
        let error = new NoMessageInQueueError();
        error.message.should.match('The are no messages in the queue');
        done();
    });


});