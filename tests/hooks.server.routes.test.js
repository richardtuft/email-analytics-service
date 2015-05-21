'use strict';

let should = require('should'),
    request = require('supertest'),
    app = require('../server'),
    agent = request.agent(app);

/* One of the available event examples */
let events = [];



describe('Hooks tests:', () => {

    beforeEach((done) => {
        let bounceExample = require('./events/bounce.json');
        let deliveredExample = require('./events/delivered.json');
        events = events.concat([bounceExample, deliveredExample]);
        done();
    });

    it('responds with OK when a POST is received', (done) => {
        // Save a new example
        agent.post('/hooks')
            .send(events)
            .expect(200)
            .end((hooksPostErr, hooksPostRes) => {
                if (hooksPostErr) {
                    done(hooksPostErr);
                }
                hooksPostRes.text.should.match('OK');
                done();
            });
    });

    afterEach((done) => {
        events.length = 0;
        done();
    });

});