'use strict';

// External Dependencies
const should = require('should');

// Our Modules
const eventParser = require('../app/utils/eventParser.server.utils');

// Constants
const now = Date.now();


describe('Event Parser Unit tests:', () => {

    it('correctly parses a BOUNCE event', (done) => {
        let rawEvent = require ('./events/bounce.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('bounce');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a CLICK event', (done) => {
        let rawEvent = require ('./events/click.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('click');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a DEFERRED event', (done) => {
        let rawEvent = require ('./events/deferred.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('deferred');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a DELIVERED event', (done) => {
        let rawEvent = require ('./events/delivered.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('delivered');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a DROPPED event', (done) => {
        let rawEvent = require ('./events/dropped.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('dropped');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a GROUP RESUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/group_resubscribe.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('group_resubscribe');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a GROUP UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/group_unsubscribe.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('group_unsubscribe');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a OPEN event', (done) => {
        let rawEvent = require ('./events/open.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('open');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a PROCESSED event', (done) => {
        let rawEvent = require ('./events/processed.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('processed');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a SPAM REPORT event', (done) => {
        let rawEvent = require ('./events/spamreport.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('spamreport');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });

    it('correctly parses a UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/unsubscribe.json');
        rawEvent.timestamp = now;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('unsubscribe');
        parsedEvent.source.should.match('email.something');
        parsedEvent.meta.eventTimestamp.should.match(now);

        done();

    });


});