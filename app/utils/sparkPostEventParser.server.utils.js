'use strict';

const extend = require('extend');
const logger = require('../../config/logger');

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
            version: '1.0.0',
            "api_key": ''
        }
    };

    let rawEventMsys = rawEvent.msys;
    let rawEventBody;

    if (!Object.keys(rawEventMsys).length) {
        //This is a test event from Sparkpost
        return {};
    }

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
    else if (rawEventMsys.relay_event) {
        rawEventBody = rawEventMsys.relay_event;
    }
    else {
        throw(new Error('EVENTPARSER: unrecognised event type: ' + Object.keys(rawEventMsys)));
    }

    delete rawEventBody.rcpt_to;

    switch (rawEventBody.type) {

        // Specific type-based event handling
        case 'bounce':
            break;

        case 'click':
            break;

        case 'delay':
            break;

        case 'delivery':
            break;

        case 'generation_failure':
            break;

        case 'generation_rejection':
            break;

        case 'injection':
            break;

        case 'list_unsubscribe':
            break;

        case 'link_unsubscribe':
            break;

        case 'open':
            break;

        case 'out_of_band':
            break;

        case 'policy_rejection':
            break;

        case 'spam_complaint':
            break;

        default:
            throw(new Error('EVENTPARSER: unrecognised event type: ' + rawEventBody.type));

    }

    if (rawEventBody.rcpt_meta) {

        let ft_guid = rawEventBody.rcpt_meta.userUuid;

        parsedEvent.user = {
            ft_guid: ft_guid
        };

    }
    
    if (rawEventBody.event_id) {
        parsedEvent.context.eventId = rawEventBody.event_id;
    }

    // Not every SparkPost event type has the following properties:
    if (rawEventBody.user_agent || rawEventBody.geo_ip) {
        parsedEvent.device = {};
        
        if (rawEventBody.user_agent) {
            parsedEvent.device.user_agent = rawEventBody.user_agent;
        }

        if (rawEventBody.geo_ip) {
            parsedEvent.device.geo = rawEventBody.geo_ip;
        }
  
    }

    if (rawEventBody.target_link_name) {
        parsedEvent.context.targetLinkName = rawEventBody.target_link_name;
    }

    if (rawEventBody.target_link_url) {
        parsedEvent.context.targetLinkUrl = rawEventBody.target_link_url;
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

    if (rawEventBody.bounce_class) {
        parsedEvent.context.bounceClass = rawEventBody.bounce_class;
    }

    if (rawEventBody.error_code) {
        parsedEvent.context.errorCode = rawEventBody.error_code;
    }
    
    if (rawEventBody.msg_size) {
        parsedEvent.context.msgSize = parseInt(rawEventBody.msg_size, 10);
    }

    // Common to every type event handling
    parsedEvent.action = rawEventBody.type;

    parsedEvent.context.eventTimestamp = rawEventBody.timestamp;

    if (rawEventBody.rcpt_meta) {

        // Extend meta property with the incoming meta
        extend(parsedEvent.context, rawEventBody.rcpt_meta);

    }

    return parsedEvent;

};
