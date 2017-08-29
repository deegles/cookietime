import * as big from "bignumber.js";
import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    console.log("cookies: " + JSON.stringify(attr.CookieCounter));
    let counter: big.BigNumber = new big(attr.CookieCounter).add(1);

    model.speech = `Your cookie count is: ${counter.toExponential(2)}`;
    model.reprompt = model.speech;

    attr.CookieCounter = counter;

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": (attr: Attributes) => {
        return Frames["Start"];
    },
    "AMAZON.RepeatIntent": (attr: Attributes) => {
        return Frames["Cookie"];
    },
    "CookieIntent": (attr: Attributes) => {
        return Frames["Cookie"];
    },
    "AMAZON.NoIntent": (attr: Attributes) => {
        return Frames["InProgress"];
    },
    "SessionEndedRequest": (attr: Attributes) => {
        console.log("Session ended in cookie!");
        attr.CurrentFrameId = "Start";
        attr.FrameStack = [];
        return Frames["Start"];
    }
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Cookie", entry, unhandled, actionMap);