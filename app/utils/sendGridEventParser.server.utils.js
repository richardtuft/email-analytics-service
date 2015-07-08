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
        context: {},
        system: {
            source: 'email-analytics',
            version: '0.6.2',
            "api_key": ''
        }
    };

    switch (rawEvent.event) {

        // Specific type-based event handling
        case 'bounce':
            break;

        case 'click':
            break;

        case 'deferred':
            break;

        case 'delivered':
            break;

        case 'dropped':
            break;

        case 'group_resubscribe':
            break;

        case 'group_unsubscribe':
            break;

        case 'open':
            break;

        case 'processed':
            break;

        case 'spamreport':
            break;

        case 'unsubscribe':
            break;

        default:
            throw(new Error('EVENTPARSER: unrecognised event type: ' + rawEvent.type));

    }

    // Not evert event type has useragent information
    if (rawEvent.useragent) {
        parsedEvent.context.useragent = rawEvent.useragent;
    }

    // Not evert event type has a "reason" property
    if (rawEvent.reason) {
        parsedEvent.context.reason = rawEvent.reason;
    }

    // Common to every type event handling
    parsedEvent.action = rawEvent.event;

    parsedEvent.context.eventTimestamp = rawEvent.timestamp;

    // Extend meta property with the incoming meta
    extend(parsedEvent.context, rawEvent.meta);

    return parsedEvent;

};
