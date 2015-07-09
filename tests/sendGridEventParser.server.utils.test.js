'use strict';

// External Dependencies
const should = require('should');

// Our Modules
const eventParser = require('../app/utils/sendGridEventParser.server.utils');
const meta = require('./meta/meta.json');
const source = 'email-analytics';


describe('SendGrid Event Parser Unit tests:', () => {

    it('correctly parses a BOUNCE event', (done) => {
        let rawEvent = require ('./events/sendgrid/bounce.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('bounce');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a CLICK event', (done) => {
        let rawEvent = require ('./events/sendgrid/click.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let useragent = rawEvent.useragent;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('click');
        parsedEvent.system.source.should.match(source);
        should.exist(parsedEvent.context.useragent);
        parsedEvent.context.useragent.should.match(useragent);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DEFERRED event', (done) => {
        let rawEvent = require ('./events/sendgrid/deferred.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('deferred');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DELIVERED event', (done) => {
        let rawEvent = require ('./events/sendgrid/delivered.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('delivered');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DROPPED event', (done) => {
        let rawEvent = require ('./events/sendgrid/dropped.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('dropped');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a GROUP RESUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/sendgrid/group_resubscribe.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('group_resubscribe');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a GROUP UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/sendgrid/group_unsubscribe.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('group_unsubscribe');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a OPEN event', (done) => {
        let rawEvent = require ('./events/sendgrid/open.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let useragent = rawEvent.useragent;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('open');
        parsedEvent.system.source.should.match(source);
        should.exist(parsedEvent.context.useragent);
        parsedEvent.context.useragent.should.match(useragent);
        should.exist(parsedEvent.context.eventTimestamp);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a PROCESSED event', (done) => {
        let rawEvent = require ('./events/sendgrid/processed.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('processed');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a SPAM REPORT event', (done) => {
        let rawEvent = require ('./events/sendgrid/spamreport.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('spamreport');
        parsedEvent.system.source.should.match(source);
        should.exist(parsedEvent.context.eventTimestamp);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/sendgrid/unsubscribe.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('unsubscribe');
        parsedEvent.system.source.should.match(source);
        should.exist(parsedEvent.context.eventTimestamp);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly throws an exception if the message type is not recognised', (done) => {
        let rawEvent = require ('./events/sendgrid/unsubscribe.json');
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