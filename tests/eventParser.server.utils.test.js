'use strict';

// External Dependencies
const should = require('should');

// Our Modules
const eventParser = require('../app/utils/eventParser.server.utils');

describe('Event Parser Unit tests:', () => {

    it('correctly parses a BOUNCE event', (done) => {
        let rawEvent = require ('./events/bounce.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('bounce');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a CLICK event', (done) => {
        let rawEvent = require ('./events/click.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('click');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a DEFERRED event', (done) => {
        let rawEvent = require ('./events/deferred.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('deferred');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a DELIVERED event', (done) => {
        let rawEvent = require ('./events/delivered.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('delivered');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a DROPPED event', (done) => {
        let rawEvent = require ('./events/dropped.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('dropped');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a GROUP RESUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/group_resubscribe.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('group_resubscribe');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a GROUP UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/group_unsubscribe.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('group_unsubscribe');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a OPEN event', (done) => {
        let rawEvent = require ('./events/open.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('open');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a PROCESSED event', (done) => {
        let rawEvent = require ('./events/processed.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('processed');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a SPAM REPORT event', (done) => {
        let rawEvent = require ('./events/spamreport.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('spamreport');
        parsedEvent.email.should.match('email@example.com');

        done();

    });

    it('correctly parses a UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/unsubscribe.json');
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.type.should.match('unsubscribe');
        parsedEvent.email.should.match('email@example.com');

        done();

    });


});