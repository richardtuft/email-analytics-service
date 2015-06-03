'use strict';

// External modules
const should = require('should');

// Internal modules
const forever = require('../app/utils/forever.server.utils');

describe('Forever Unit Tests:', () => {


   it('continuously call the argument function when its promise is resolved', (done) => {

       let count = 0;

       function fulfillingPromise () {

           return new Promise((fulfill, reject) => {
               if (count < 50) {
                   count += 1;
                   fulfill(count);
               } else {
                   reject('Too big');
               }
           });
       }

       forever(fulfillingPromise)
           .then(() => {
               done('This should not happen');
           })
           .catch((err) => {
               err.should.be.an.error;
               err.should.match('Too big');
               count.should.match(50);
               done();
           });
   });

});
