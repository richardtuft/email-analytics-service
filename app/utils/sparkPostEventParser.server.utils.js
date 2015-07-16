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
        category: "email",
        system: {
            source: 'email-analytics',
            version: '0.6.2',
            "api_key": ''
        }
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

    let ft_guid = rawEventBody.rcpt_meta.userUuid;

    parsedEvent.user = {
        ft_guid: ft_guid
    };

    // Not every SparkPost event type has the following properties:
    if (rawEventBody.user_agent || rawEventBody.geo_ip) {
        parsedEvent.device = {};
    }

    if (rawEventBody.user_agent) {
        parsedEvent.device.user_agent = rawEventBody.user_agent;
    }

    if (rawEventBody.geo_ip) {
        parsedEvent.device.geo = rawEventBody.geo_ip;
    }

    if (rawEventBody.target_link_name) {
        parsedEvent.context.targetLinkName = rawEventBody.target_link_name;
    }

    if (rawEventBody.target_link_url) {
        parsedEvent.context.targetLinkUrl = rawEventBody.target_link_url;
    }

    if (rawEventBody.geo_ip) {
        parsedEvent.context.geoIp = rawEventBody.geo_ip;
    }

    if (rawEventBody.fbtype) {
        parsedEvent.context.fbType = rawEventBody.fbtype;
    }

    if (rawEventBody.user_str) {
        parsedEvent.context.userString = rawEventBody.user_str;
    }

    if (rawEventBody.reason) {
        parsedEvent.context.reason = rawEventBody.reason;
    }

    // Common to every type event handling
    parsedEvent.action = rawEventBody.type;

    parsedEvent.context.eventTimestamp = rawEventBody.timestamp;

    // Extend meta property with the incoming meta
    extend(parsedEvent.context, rawEventBody.rcpt_meta);

    return parsedEvent;

};
