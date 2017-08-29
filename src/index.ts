"use strict";
import {Callback, Context} from "aws-lambda";
import * as util from "util";
import {AlexaRequestBody, AlexaRequestType, AlexaResponseBody, IntentRequest} from "./definitions/AlexaService";
import {ResponseContext} from "./definitions/Handler";
import {Attributes, RequestContext as SkillContext} from "./definitions/SkillContext";

import * as Frames from "./definitions/FrameDirectory";
import * as Views from "./definitions/ViewsDirectory";

import {DAL} from "./resources/dal";

import "./resources/imports";

let dal = new DAL("deeglescoSkillUserSessions");

let handler = async function (event: AlexaRequestBody, context: Context, callback: Callback): Promise<void> {

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
        let ctx = new SkillContext(event, context, callback);

        let attributes;
        if (event.session.new) {
            attributes = new Attributes(await dal.get(customerId));
        } else {
            attributes = new Attributes(event.session.attributes);
        }

        let frame = Frames[attributes.CurrentFrameId];
        let intent = getIntent(event);

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

        console.log("response:\n%j", response);

        if (response.response.shouldEndSession || intent === "SessionEndedRequest") {
            await dal.set(customerId, attributes);
        }

        callback(undefined, response);
    } catch (err) {
        console.log("Error: " + JSON.stringify(err));
        callback(err, undefined);
    }
};

function getIntent(event: AlexaRequestBody): string {

    let type: AlexaRequestType = event.request.type;

    if (type === "LaunchRequest") {
        return "LaunchRequest";
    } else if (type === "SessionEndedRequest") {
        return "SessionEndedRequest";
    } else if (type === "IntentRequest") {
        return (event.request as IntentRequest).intent.name;
    } else {
        throw new Error("Unknown request type: " + JSON.stringify(event.request));
    }
}

export default handler;