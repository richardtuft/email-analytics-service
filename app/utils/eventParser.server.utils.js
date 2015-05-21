/**
    parseEvent.server.utils.js receives a JSON object and returns a valid EmailEvent Object
 **/

'use strict';

exports.parse = function(rawEvent) {

    //TODO: use EmailEvent model (and constructor)
    let parsedEvent = {};

    switch (rawEvent.event) {
        //TODO: deal with the different event types
        default:
            parsedEvent.type = rawEvent.event;
            parsedEvent.email = rawEvent.email;
    }

    return parsedEvent;

};
