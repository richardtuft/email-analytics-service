'use strict';

// TODO: mock endpoints

// External Modules
const should = require('should');

// Our Modules
const spoor = require('../app/services/spoor.server.services');

describe('Spoor tests:', () => {
    describe('The send() method:', () => {

        it('can send an event', (done) => {

        // An event
        const eventObj = {
            type: 'delivered',
            timestamp: Date.now()
        };
        spoor.send(JSON.stringify(eventObj))
            .then((res) => {
                res.status.should.be.above(200).and.be.below(299);
                done();
            })
            .catch((err) =>{
                done(err);
            });

        });

    });
});