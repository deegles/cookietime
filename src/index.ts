"use strict";
import {Callback, Context} from "aws-lambda";
import * as xray from "aws-xray-sdk";
import "source-map-support/register";
import * as util from "util";
import {
    AlexaRequestBody, AlexaRequestType, AlexaResponseBody, IntentRequest
} from "./definitions/AlexaService";
import {BotFrameworkActivity} from "./definitions/BotFrameworkService";
import {RequestBody} from "./definitions/Common";
import * as Frames from "./definitions/FrameDirectory";
import {ResponseContext} from "./definitions/Handler";
import {LUISServiceResponse} from "./definitions/LUISService";
import {AlexaRequestContext, Attributes, CortanaRequestContext} from "./definitions/SkillContext";
import * as Views from "./definitions/ViewsDirectory";

import {DAL} from "./resources/dal";

import {sendActivity} from "./resources/BotFramework";
import "./resources/imports";
import {query} from "./resources/LUIS";
import {getBotframeworkToken} from "./resources/MSATokenService";
import {getIntent} from "./resources/utilities";

let dal = new DAL("cookieTimeUserSessions");

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
        callback = (error: any, result?: any) => {
            console.log("Alexa Response:\n" + JSON.stringify(error || result));
            return cb(error, result);
        };
        await processAlexaEvent(APIEvent as AlexaRequestBody, context, callback);
    }
};

let routes: { [key: string]: (event: RequestBody, context: Context, callback: Callback) => Promise<void> } = {
    "/cortana": processBotFrameworkEvent
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

async function processBotFrameworkEvent(event: any, context: Context, callback: Callback): Promise<void> {
    try {
        let token = await getBotframeworkToken();

        let request = JSON.parse(event["body"]) as BotFrameworkActivity;
        let nluResult, sendActivityResult, responseActivity;

        console.log("Activity:\n%j", request);

        if (request.type === "conversationUpdate") {
            console.log("conversation update...");
        } else if (request.type === "message") {
            if (request.text) {
                nluResult = await query(request.text) as LUISServiceResponse;
                console.log("NLU:\n%j", nluResult);
            }

            let attributes = new Attributes(await dal.get(request.from.id));

            let requestCtx = await new CortanaRequestContext(request, nluResult);

            xray["captureFunc"]("SkillCode", (subsegment) => {

                let frame = Frames[attributes.CurrentFrameId];

                if (requestCtx.intent in frame.actions) {
                    frame = frame.actions[requestCtx.intent](attributes, requestCtx);
                } else {
                    frame = frame.unhandled(attributes, requestCtx);
                }

                attributes.CurrentFrameId = frame.id;

                let responseCtx: ResponseContext = frame.entry(attributes, requestCtx);

                let view = Views["BotFrameworkActivity"];

                responseActivity = view.render(responseCtx.model, request);
                subsegment.close();
            });

            // Clean up unneeded attributes before saving
            delete attributes.NextUpgrades;

            await dal.set(request.from.id, attributes);

            console.log("Response:\n%j" + JSON.stringify(responseActivity));

            sendActivityResult = await sendActivity(responseActivity, request.serviceUrl, request.conversation.id, request.id, token.access_token);
            console.log("sent: %j", sendActivityResult);
        } else {
            console.log("Unknown request type: " + request.type);
        }

        callback();
    } catch (err) {
        console.log("Bot framework Error: " + err.stack);
        callback(new Error("Internal error processing Bot Framework event: " + err));
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
        let ctx = new AlexaRequestContext(event);

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