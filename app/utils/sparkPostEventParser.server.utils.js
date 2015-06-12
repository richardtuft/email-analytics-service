'use strict';

const extend = require('extend');

/**
 * parse() receives a JSON object and returns a valid EmailEvent Object
 * @param rawEvent Object The raw event received
 * @returns Object A formatted event object
 */
exports.parse = (rawEvent) => {

    //TODO: use EmailEvent model (and constructor)
    let parsedEvent = {
        meta: {}
    };

    let rawEventMsys = rawEvent.msys;
    let rawEventBody;

    if (rawEventMsys.message_event) {
        rawEventBody = rawEventMsys.message_event;
    }
    else if (rawEventMsys.track_event) {
        rawEventBody = rawEventMsys.track_event;
    }
    else if (rawEventMsys.gen_event) {
        rawEventBody = rawEventMsys.gen_event;
    }
    else if (rawEventMsys.unsubscribe_event) {
        rawEventBody = rawEventMsys.unsubscribe_event;
    }
    else {
        throw(new Error('EVENTPARSER: unrecognised event type: ' + Object.keys(rawEventMsys)));
    }

    switch (rawEventBody.type) {

        // Specific type-based event handling
        case 'bounce': // ~ bounce/dropped
            break;

        case 'click': // ~ click
            break;

        case 'delay': // ~ deferred
            break;

        case 'delivery': // ~ delivered
            break;

        case 'generation_failure': // NONE
            break;

        case 'generation_rejection': // NONE
            break;

        case 'injection': // ~ processed
            break;

        case 'list_unsubscribe': // ~ unsubscribe
            break;

        case 'link_unsubscribe': // ~ unsubscribe
            break;

        case 'open': // ~ open
            break;

        case 'out_of_band': // NONE
            break;

        case 'policy_rejection': // NONE
            break;

        case 'spam_complaint': // ~ spamreport
            break;

        default:
            throw(new Error('EVENTPARSER: unrecognised event type: ' + rawEventBody.type));

    }

    // Not evert event type has useragent information
    if (rawEventBody.user_agent) {
        parsedEvent.meta.useragent = rawEventBody.user_agent;
    }

    // Common to every type event handling
    parsedEvent.event = rawEventBody.type;

    parsedEvent.source = 'email' + '.' + (rawEventBody.rcpt_meta && rawEventBody.rcpt_meta.source ? rawEventBody.rcpt_meta.source : 'unknown');
    parsedEvent.meta.eventTimestamp = rawEventBody.timestamp;

    // Extend meta property with the incoming meta
    extend(parsedEvent.meta, rawEventBody.rcpt_meta);

    return parsedEvent;

};
