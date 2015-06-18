'use strict';

// External dependencies
const should = require('should');
const request = require('supertest');

// Our dependencies
const app = require('../server');


const agent = request.agent(app);

describe('__health tests:', () => {
    it('responds with a JSON Object when a GET is received', (done) => {
        agent.get('/__health')
            .expect(200)
            .end((hooksPostErr, hooksPostRes) => {
                if (hooksPostErr) {
                    done(hooksPostErr);
                }
                hooksPostRes.body.should.be.an.Object.with.property('schemaVersion', 1);
                hooksPostRes.body.should.be.an.Object.with.property('name', 'Email Platform Analytics');
                hooksPostRes.body.should.be.an.Object.with.property('description', 'Email Platform Analytics Webhook');

                done();
            });


    });
});