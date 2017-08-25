"use strict";
import {Callback, Context} from "aws-lambda";
import * as util from "util";
import {AlexaRequestBody} from "./definitions/AlexaService";
import {ResponseContext} from "./definitions/Handler";
import {Context as SkillContext} from "./definitions/SkillContext";

let Frames = require("./definitions/FrameDirectory");
let Views = require("./definitions/ViewsDirectory");

// TODO: find workaround for this
require("./handlers/Start");
require("./views/AlexaStandard");

let handler = function (event: AlexaRequestBody, context: Context, callback: Callback): void {

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
        let currentFrame = event.session.attributes["_CurrentFrame"];
        let ctx = new SkillContext(event, context, callback, event.session.attributes);

        let frame = Frames[currentFrame || "Start"];

        let responseCtx: ResponseContext = frame.entry(ctx);

        console.log("model: " + JSON.stringify(responseCtx.model));

        let view = Views["AlexaStandard"];

        let response = view.render(responseCtx.model);

        console.log("response: %j", response);

        callback(undefined, response);

    } catch (err) {
        console.log("Error: " + JSON.stringify(err));
        callback(err, undefined);
    }
};


export default handler;