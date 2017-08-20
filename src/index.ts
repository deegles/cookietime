"use strict";
require("source-map-support").install(); // Required for source maps to work when debugging
import * as Alexa from "alexa-sdk";
import * as util from "util";
import * as stateHandlers from "./handlers/States";

let handler = function (event: Alexa.RequestBody, context: Alexa.Context, callback: Function): void {
    let alexa = Alexa.handler(event, context, callback);
    // alexa.dynamoDBTableName = "SkillUserSessions"; // Store user session data

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

    Object.defineProperty(alexa, "log", {
        value: log
    });

    function err() {
        console.error("%j", {
            message: util.format.apply(this, arguments),
            id: customerId,
            session: sessionId,
            timestamp: new Date().getTime(),
            eventType: "error"
        });
    }

    Object.defineProperty(alexa, "error", {
        value: err
    });

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

    try {
        stateHandlers.states.forEach(stateHandler => {
            alexa.registerHandlers(stateHandler);
        });
    } catch (err) {
        return context.fail("Error loading state handlers: " + err);
    }

    console.log("---- Session start ----");

    try {
        alexa.resources = require("./resources/strings.json");
        alexa.execute();
    } catch (err) {
        context.fail(err);
    }
};


export default handler;