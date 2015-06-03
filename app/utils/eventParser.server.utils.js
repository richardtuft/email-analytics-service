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
        parsedEvent.meta.useragent = rawEvent.useragent;
    }

    // Common to every type event handling
    parsedEvent.event = rawEvent.event;
    parsedEvent.source = 'email' + '.' + rawEvent.meta.source;
    parsedEvent.meta.eventTimestamp = rawEvent.timestamp;

    // Extend meta property with the incoming meta
    extend(parsedEvent.meta, rawEvent.meta);

    return parsedEvent;

};
