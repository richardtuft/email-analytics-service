'use strict';

// TODO: mock endpoints

// External Modules
const should = require('should');

// Our Modules
const spoor = require('../app/services/spoor.server.services');

describe.skip('Spoor tests:', () => { //TODO: Remove SKIP when spoor is up again

    describe('The send() method:', () => {

        it('can send an event', (done) => {

        // An event
        const eventObj = {
            type: 'delivered',
            timestamp: Date.now()
        };
        spoor.send(eventObj)
            .then((res) => {
                res.status.should.match(200);
                done();
            })
            .catch((err) =>{
                done(err);
            });

        });

    });
});