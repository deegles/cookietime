import * as big from "bignumber.js";
import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {getIntent} from "../resources/utilities";

let entry = (attr: Attributes, ctx: RequestContext) => {

    if (attr.Model) {
        return new ResponseContext(attr.Model);
    }

    let model = new ResponseModel();

    model.speech = `There is nothing to repeat.`;
    model.reprompt = model.speech;

    return new ResponseContext(model);
};

let actionMap = {};

let unhandled = (attr: Attributes, ctx: RequestContext) => {
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
};

new Frame("Repeat", entry, unhandled, actionMap);
