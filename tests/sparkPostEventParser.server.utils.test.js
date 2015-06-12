'use strict';

// External Dependencies
const should = require('should');
const extend = require('extend');

// Our Modules
const eventParser = require('../app/utils/sparkPostEventParser.server.utils');
const meta = require('./meta/meta.json');

const metaSource = meta.source;
const source = 'email.' + metaSource;

describe('SparkPost Event Parser Unit tests:', () => {

    it('correctly parses a BOUNCE event', (done) => {
        let rawEvent = require ('./events/sparkpost/bounce.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);
        parsedEvent.event.should.match('bounce');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a CLICK event', (done) => {
        let rawEvent = require ('./events/sparkpost/click.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.track_event.timestamp;
        let useragent = rawEvent.msys.track_event.user_agent;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('click');
        parsedEvent.source.should.match(source);
        should.exist(parsedEvent.meta.useragent);
        parsedEvent.meta.useragent.should.match(useragent);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DELAY event', (done) => {
        let rawEvent = require ('./events/sparkpost/delay.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('delay');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DELIVERY event', (done) => {
        let rawEvent = require ('./events/sparkpost/delivery.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('delivery');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a GENERATION_FAILURE event', (done) => {
        let rawEvent = require ('./events/sparkpost/generation_failure.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.gen_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('generation_failure');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a GENERATION_REJECTION event', (done) => {
        let rawEvent = require ('./events/sparkpost/generation_rejection.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.gen_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('generation_rejection');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a INJECTION event', (done) => {
        let rawEvent = require ('./events/sparkpost/injection.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('injection');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a LINK_UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/sparkpost/link_unsubscribe.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.unsubscribe_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('link_unsubscribe');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a LIST_UNSUBSCRIBE event', (done) => {
        let rawEvent = require ('./events/sparkpost/list_unsubscribe.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.unsubscribe_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('list_unsubscribe');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a OPEN event', (done) => {
        let rawEvent = require ('./events/sparkpost/open.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.track_event.timestamp;
        let useragent = rawEvent.msys.track_event.user_agent;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('open');
        parsedEvent.source.should.match(source);
        should.exist(parsedEvent.meta.useragent);
        parsedEvent.meta.useragent.should.match(useragent);
        should.exist(parsedEvent.meta.eventTimestamp);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a OUT_OF_BAND event', (done) => {
        let rawEvent = require ('./events/sparkpost/out_of_band.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('out_of_band');
        parsedEvent.source.should.match(source);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a POLICY_REJECTION event', (done) => {
        let rawEvent = require ('./events/sparkpost/policy_rejection.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('policy_rejection');
        parsedEvent.source.should.match(source);
        should.exist(parsedEvent.meta.eventTimestamp);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a SPAM_COMPLAINT event', (done) => {
        let rawEvent = require ('./events/sparkpost/spam_complaint.json');
        rawEvent.meta = meta;

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('spam_complaint');
        parsedEvent.source.should.match(source);
        should.exist(parsedEvent.meta.eventTimestamp);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly throws an exception if the message type is not recognised', (done) => {
        let rawEvent = extend({}, require ('./events/sparkpost/bounce.json'));
        rawEvent.meta = meta;
        rawEvent.msys = 'wrongType';

        try {
            eventParser.parse(rawEvent);
        }
        catch (parseErr) {
            parseErr.should.be.an.error;
            done();
            return;
        }
        done('We should not be here');

    });


    it('correctly throws an exception if the event type is not recognised', (done) => {

        let rawEvent = extend({}, require ('./events/sparkpost/bounce.json'));
        rawEvent.meta = meta;
        rawEvent.msys.message_event.type = 'wrongType';

        try {
            eventParser.parse(rawEvent);
        }
        catch (parseErr) {
            parseErr.should.be.an.error;
            done();
            return;
        }
        done('We should not be here');

    });

    it('deals with events without source', (done) => {

        let rawEvent = extend({}, require('./events/sparkpost/delay.json'));
        rawEvent.meta = meta;

        delete rawEvent.meta.source;

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.event.should.match('delay');
        parsedEvent.source.should.match('email.unknown');
        should.exist(parsedEvent.meta.eventTimestamp);
        parsedEvent.meta.eventTimestamp.should.match(timestamp);

        done();
    });

    after((done) => {
        meta.source = metaSource;
        done();
    });

});