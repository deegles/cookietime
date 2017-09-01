import * as big from "bignumber.js";
import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";

let entry = (attr: Attributes, ctx: RequestContext) => {

    if (attr.Model) {
        return new ResponseContext(attr.Model);
    }

    let model = new ResponseModel();

    model.speech = `There is nothing to repeat.`;
    model.reprompt = model.speech;

    return new ResponseContext(model);
};

let actionMap = {
    "AMAZON.RepeatIntent": (attr: Attributes) => {
        return Frames["Repeat"];
    },
    "SessionEndedRequest": (attr: Attributes) => {
        console.log("Session ended in repeat!");
        attr.CurrentFrameId = "Start";
        attr.FrameStack = [];
        delete attr.Model;
        return Frames["Start"];
    }
};

let unhandled = (attr: Attributes) => {
    return Frames[attr.FrameStack.pop() || "Start"];
};

new Frame("Repeat", entry, unhandled, actionMap);
