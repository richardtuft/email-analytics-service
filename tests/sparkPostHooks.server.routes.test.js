'use strict';

// External dependencies
const should = require('should');
const request = require('supertest');

// Our dependencies
const app = require('../server');


const agent = request.agent(app);

const bounceExample = require('./events/sparkpost/injection.json');
const deliveredExample = require('./events/sparkpost/open.json');
const meta = require('./meta/meta.json');

bounceExample.meta = meta;
deliveredExample.meta = meta;

describe('SparkPost Hooks tests:', () => {

    it('responds with OK when a POST is received', (done) => {

        let events = [bounceExample, deliveredExample];

        // Save a new example
        agent.post('/hooks/sparkpost')
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

});