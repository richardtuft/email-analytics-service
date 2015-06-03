'use strict';

/**
 * parse() receives a JSON object and returns a valid EmailEvent Object
 * @param rawEvent Object The raw event received
 * @returns Object A formatted event object
 */
exports.parse = (rawEvent) => {

    //TODO: use EmailEvent model (and constructor)
    let parsedEvent = {};

    switch (rawEvent.event) {

        //TODO: Specific type-based event handling
        case 'bounce':
        case 'click':
        case 'deferred':
        case 'delivered':
        case 'dropped':
        case 'group_resubscribe':
        case 'group_unsubscribe':
        case 'open':
        case 'processed':
        case 'spamreport':
        case 'unsubscribe':
            break;
        default:
            throw(new Error('EVENTPARSER: unrecognised event type: ' + rawEvent.type));

    }

    // Common to every type event handling
    parsedEvent.event = rawEvent.event;
    parsedEvent.source = 'email' + '.' + 'something'; //TODO: add source
    parsedEvent.meta = {
        eventTimestamp: rawEvent.timestamp
    };

    return parsedEvent;

};
