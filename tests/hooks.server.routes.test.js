'use strict';

let should = require('should'),
    request = require('supertest'),
    app = require('../server'),
    agent = request.agent(app);

describe('Hooks tests:', () => {

    it('responds with OK when a POST is received', (done) => {
        // Save a new example
        agent.post('/hooks')
            .send({})
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