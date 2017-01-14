'use strict';

// External Dependencies
const should = require('should');

// Our Modules
const eventParser = require('../app/utils/sparkPostEventParser.server.utils');
const source = 'email-analytics';

let meta = require('./meta/meta.json');
let baseEvent = require('./events/sparkpost/bounce.json');

describe.only('SparkPost Event Parser Unit tests:', () => {

    it('correctly parses a BOUNCE event', (done) => {
        let rawEvent = Object.assign({}, baseEvent);
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);
        parsedEvent.action.should.match('bounce');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a CLICK event', (done) => {
        let rawEvent = require('./events/sparkpost/click.json');
        rawEvent.msys.track_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.track_event.timestamp;
        let useragent = rawEvent.msys.track_event.user_agent;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('click');
        parsedEvent.system.source.should.match(source);
        should.exist(parsedEvent.device.user_agent);
        parsedEvent.device.user_agent.should.match(useragent);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DELAY event', (done) => {
        let rawEvent = require('./events/sparkpost/delay.json');
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('delay');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a DELIVERY event', (done) => {
        let rawEvent = require('./events/sparkpost/delivery.json');
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('delivery');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a GENERATION_FAILURE event', (done) => {
        let rawEvent = require('./events/sparkpost/generation_failure.json');
        rawEvent.msys.gen_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.gen_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('generation_failure');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a GENERATION_REJECTION event', (done) => {
        let rawEvent = require('./events/sparkpost/generation_rejection.json');
        rawEvent.msys.gen_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.gen_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('generation_rejection');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a INJECTION event', (done) => {
        let rawEvent = require('./events/sparkpost/injection.json');
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('injection');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a LINK_UNSUBSCRIBE event', (done) => {
        let rawEvent = require('./events/sparkpost/link_unsubscribe.json');
        rawEvent.msys.unsubscribe_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.unsubscribe_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('link_unsubscribe');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a LIST_UNSUBSCRIBE event', (done) => {
        let rawEvent = require('./events/sparkpost/list_unsubscribe.json');
        rawEvent.msys.unsubscribe_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.unsubscribe_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('list_unsubscribe');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a OPEN event', (done) => {
        let rawEvent = require('./events/sparkpost/open.json');
        rawEvent.msys.track_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.track_event.timestamp;
        let useragent = rawEvent.msys.track_event.user_agent;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('open');
        parsedEvent.system.source.should.match(source);
        should.exist(parsedEvent.device.user_agent);
        parsedEvent.device.user_agent.should.match(useragent);
        should.exist(parsedEvent.context.eventTimestamp);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a OUT_OF_BAND event', (done) => {
        let rawEvent = require('./events/sparkpost/out_of_band.json');
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('out_of_band');
        parsedEvent.system.source.should.match(source);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a POLICY_REJECTION event', (done) => {
        let rawEvent = require('./events/sparkpost/policy_rejection.json');
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('policy_rejection');
        parsedEvent.system.source.should.match(source);
        should.exist(parsedEvent.context.eventTimestamp);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly parses a SPAM_COMPLAINT event', (done) => {
        let rawEvent = require('./events/sparkpost/spam_complaint.json');
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);

        let timestamp = rawEvent.msys.message_event.timestamp;
        let parsedEvent = eventParser.parse(rawEvent);

        parsedEvent.action.should.match('spam_complaint');
        parsedEvent.system.source.should.match(source);
        should.exist(parsedEvent.context.eventTimestamp);
        parsedEvent.context.eventTimestamp.should.match(timestamp);

        done();

    });

    it('correctly throws an exception if the message type is not recognised', (done) => {
        let rawEvent = Object.assign({}, baseEvent);
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

        let rawEvent = Object.assign({}, require ('./events/sparkpost/bounce.json'));
        rawEvent.msys = Object.assign({}, baseEvent.msys);
        rawEvent.msys.message_event = Object.assign({}, baseEvent.msys.messageEvent, { type: 'wrong' });

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

    it('returns null if event is a test event and filter test events is true', (done) => {

        let rawEvent = Object.assign({}, require ('./events/sparkpost/bounce.json'));
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);
        rawEvent.msys.message_event.rcpt_meta.product = 'test';

        const parsedEvent = eventParser.parse(rawEvent, true);
        should(parsedEvent).not.be.ok();
        done();

    });

    it('returns parsed event if is test event and filter test events is false', (done) => {

        let rawEvent = Object.assign({}, require ('./events/sparkpost/bounce.json'));
        rawEvent.msys.message_event.rcpt_meta = Object.assign({}, meta);
        rawEvent.msys.message_event.rcpt_meta.product = 'test';

        const parsedEvent = eventParser.parse(rawEvent, false);
        should(parsedEvent).be.ok();
        done();

    });

});
