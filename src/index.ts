"use strict";
import * as verifier from "alexa-verifier";
import {Callback, Context} from "aws-lambda";
import "source-map-support/register";
import * as util from "util";
import {
    AlexaRequestBody, AlexaRequestType, AlexaResponseBody, IntentRequest
} from "./definitions/AlexaService";
import {BotFrameWorkRequestBody} from "./definitions/BotFrameworkService";
import {RequestBody} from "./definitions/Common";
import * as Frames from "./definitions/FrameDirectory";
import {ResponseContext} from "./definitions/Handler";
import {AlexaRequestContext, Attributes} from "./definitions/SkillContext";
import * as Views from "./definitions/ViewsDirectory";

import {DAL} from "./resources/dal";

import "./resources/imports";
import {query} from "./resources/LUIS";
import {getBotframeworkToken} from "./resources/MSATokenService";
import {getIntent} from "./resources/utilities";

let dal = new DAL("deeglescoSkillUserSessions");

let handler = async function (APIEvent: any, context: Context, callback: Callback): Promise<void> {
    if (APIEvent["source"] && APIEvent["source"] === "aws.events"
        && APIEvent["detail-type"] && APIEvent["detail-type"] === "Scheduled Event") {
        console.log("Warmup event...");
        return callback(undefined, {});
    }

    let cb = callback;
    let event;
    if (APIEvent.resource) {
        callback = (error: any, result?: any) => {
            let response = {
                "headers": {},
                "statusCode": error ? 400 : 200,
                "body": JSON.stringify(error || result)

            };
            console.log("API GW Response:\n%j", response);
            return cb(undefined, response);
        };

        await routeAPIGatewayEvent(APIEvent, context, callback);
    } else {
        event = JSON.parse(APIEvent.body) as AlexaRequestBody;
        callback = (error: any, result?: any) => {
            console.log("Alexa Response:\n" + JSON.stringify(error || result));
            return cb(error, result);
        };
        await processAlexaEvent(event, context, callback);
    }
};

let routes: { [key: string]: (event: RequestBody, context: Context, callback: Callback) => Promise<void> } = {
    "/cortana": processCortanaEvent
};

async function routeAPIGatewayEvent(APIEvent: any, context: Context, callback: Callback): Promise<void> {
    let headers = APIEvent.headers;

    try {
        // TODO: check authorization header

        let func = routes[APIEvent.resource];

        if (func) {
            await func(APIEvent, context, callback);
        } else {
            callback(new Error("No handler defined for resource: " + APIEvent.resource));
        }

    } catch (e) {
        console.log("error routing: " + e);
        callback(new Error("Internal error: " + e));
    }
}

async function processCortanaEvent(event: any, context: Context, callback: Callback): Promise<void> {
    try {
        let token = await getBotframeworkToken();

        let request = JSON.parse(event["body"]) as BotFrameWorkRequestBody;

        let text = request.text;

        if (text) {
            let nluResult = await query(text);
            console.log("NLU:\n%j", nluResult);
        }
    } catch (err) {
        console.log("Error: %j %j", err, err.stack);
        callback(new Error("Internal error processing Cortana event: " + err));

    }
}

async function processAlexaEvent(event: AlexaRequestBody, context: Context, callback: Callback): Promise<void> {

    let customerId = event.context ? event.context.System.user.userId : event.session.user.userId;
    let sessionId = event.session.sessionId;

    console.log("%j", {
        message: util.format("%j", event),
        id: customerId,
        session: sessionId,
        timestamp: new Date().getTime(),
        eventType: "event"
    });

    function log() {
        console.log("%j", {
            message: util.format.apply(this, arguments),
            id: customerId,
            session: sessionId,
            timestamp: new Date().getTime(),
            eventType: "log"
        });
    }

    function err() {
        console.error("%j", {
            message: util.format.apply(this, arguments),
            id: customerId,
            session: sessionId,
            timestamp: new Date().getTime(),
            eventType: "error"
        });
    }

    let succeed = context.succeed;

    context.succeed = function (payload) {
        console.log("%j", {
            message: util.format("%j", payload),
            id: customerId,
            session: sessionId,
            timestamp: new Date().getTime(),
            eventType: "response"
        });
        succeed(payload);
    };

    let fail = context.fail;

    context.fail = function (payload) {
        console.log("%j", {
            message: util.format("%j", payload),
            id: customerId,
            session: sessionId,
            timestamp: new Date().getTime(),
            eventType: "error"
        });
        fail(payload);
    };

    console.log("---- Session start ----");

    if (!event.session.attributes) {
        event.session.attributes = {};
    }

    try {
        let ctx = new AlexaRequestContext(event, context, callback);

        let attributes;
        if (event.session.new) {
            attributes = new Attributes(await dal.get(customerId));
        } else {
            attributes = new Attributes(event.session.attributes);
        }

        let frame = Frames[attributes.CurrentFrameId];
        let intent = getIntent(event);

        if (!frame) {
            return callback(new Error("Could not find frame: " + attributes.CurrentFrameId), undefined);
        }

        if (event.session.new && "NewSession" in frame.actions) {
            frame = frame.actions["NewSession"](attributes, ctx);
        } else if (intent in frame.actions) {
            frame = frame.actions[intent](attributes, ctx);
        } else {
            frame = frame.unhandled(attributes, ctx);
        }

        attributes.CurrentFrameId = frame.id;

        let responseCtx: ResponseContext = frame.entry(attributes, ctx);

        let view = Views["AlexaStandard"];

        let response: AlexaResponseBody = view.render(responseCtx.model);

        response.sessionAttributes = attributes;

        if (response.response.shouldEndSession || intent === "SessionEndedRequest") {
            delete attributes.Model;
            delete attributes["FrameStack"];
            await dal.set(customerId, attributes);
        }

        /**
         *  The skill cannot return a response to SessionEndedRequest */
        if (intent === "SessionEndedRequest") {
            callback();
        } else {
            callback(undefined, response);
        }
    } catch (err) {
        console.log("Error: " + JSON.stringify(err));
        callback(err, undefined);
    }
}

export default handler;