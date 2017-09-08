import {AlexaRequestBody, AlexaRequestType, IntentRequest} from "../definitions/AlexaService";
import * as Frames from "../definitions/FrameDirectory";
import {Intents, SkillIntents} from "../definitions/Intents";
import {Attributes, RequestContext} from "../definitions/SkillContext";

/**
 * Get the current intent
 * @param event
 * @returns {any}
 */
export function getIntent(event: AlexaRequestBody): SkillIntents {

    let type: AlexaRequestType = event.request.type;

    if (type === "LaunchRequest") {
        return "LaunchRequest";
    } else if (type === "SessionEndedRequest") {
        return "SessionEndedRequest";
    } else if (type === "IntentRequest") {
        return Intents[(event.request as IntentRequest).intent.name];
    } else {
        throw new Error("Unknown request type: " + JSON.stringify(event.request));
    }
}

export function redirect(attr: Attributes, ctx: RequestContext) {
    let frame = Frames[attr.FrameStack.pop() || "Start"];

    let event = ctx.request;
    let intent = getIntent(event);

    if (event.session.new && "NewSession" in frame.actions) {
        frame = frame.actions["NewSession"](attr, ctx);
    } else if (intent in frame.actions) {
        frame = frame.actions[intent](attr, ctx);
    } else {
        frame = frame.unhandled(attr, ctx);
    }

    return frame;
}

String.prototype.padEnd = function padEnd(targetLength, padString) {
    targetLength = targetLength >> 0; // floor if number or convert non-number to 0;
    padString = String(padString || " ");
    if (this.length > targetLength) {
        return String(this);
    }
    else {
        targetLength = targetLength - this.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
        }
        return String(this) + padString.slice(0, targetLength);
    }
};
