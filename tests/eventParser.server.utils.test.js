'use strict';

// External Dependencies
const should = require('should');

// Our Modules
const eventParser = require('../app/utils/eventParser.server.utils');
const meta = require('./meta/meta.json');
const source = 'email.' + meta.source;


describe('Event Parser Unit tests:', () => {

    it('correctly parses a BOUNCE event', (done) => {
        let rawEvent = require ('./events/bounce.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('bounce');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a CLICK event', (done) => {
        let rawEvent = require ('./events/click.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let useragent = rawEvent.useragent;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('click');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.useragent.should.be.ok;
        parsedEvent.meta.useragent.should.match(useragent);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DEFERRED event', (done) => {
        let rawEvent = require ('./events/deferred.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('deferred');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DELIVERED event', (done) => {
        let rawEvent = require ('./events/delivered.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('delivered');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DROPPED event', (done) => {
        let rawEvent = require ('./events/dropped.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('dropped');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a GROUP RESUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/group_resubscribe.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('group_resubscribe');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a GROUP UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/group_unsubscribe.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('group_unsubscribe');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a OPEN event', (done) => {
        let rawEvent = require ('./events/open.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let useragent = rawEvent.useragent;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('open');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.useragent.should.be.ok;
        parsedEvent.meta.useragent.should.match(useragent);
        parsedEvent.meta.eventTimestamp.should.be.ok;
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a PROCESSED event', (done) => {
        let rawEvent = require ('./events/processed.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('processed');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a SPAM REPORT event', (done) => {
        let rawEvent = require ('./events/spamreport.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('spamreport');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.be.ok;
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/unsubscribe.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('unsubscribe');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.be.ok;
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly throws an exception if the event type is not recognised', (done) => {
        let rawEvent = require ('./events/unsubscribe.json');
        rawEvent.meta = meta;

        rawEvent.event = 'wrongType';
        let parsedEvent;

        try {
            parsedEvent = eventParser.parse(rawEvent);
        }
        catch (parseErr) {
            parseErr.should.be.an.error;
            done();
            return;
        }
        done('We should not be here');

    });


});