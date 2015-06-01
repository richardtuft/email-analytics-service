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
        //TODO: deal with the different event types
        //TODO: what to if we get an invalid event type?
        default:
            parsedEvent.event = rawEvent.event;
            parsedEvent.source = 'email' + '.' + 'something'; //TODO: add source
            parsedEvent.meta = {
                eventTimestamp: rawEvent.timestamp
            };
    }

    return parsedEvent;

};
