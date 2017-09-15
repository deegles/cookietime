import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {AlexaRequestContext, Attributes} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";

let entry = (attr: Attributes, ctx: AlexaRequestContext) => {

    let model = new ResponseModel();

    model.speech = "It's cookie time. Do you want to cook?";
    model.reprompt = "hello again";

    attr.Model = model;

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": (attr: Attributes) => {
        return Frames["Start"];
    },
    "RepeatIntent": (attr: Attributes) => {
        attr.FrameStack.push("Start");
        return Frames["Repeat"];
    },
    "EatCookieIntent": (attr: Attributes) => {
        attr.FrameStack.push("Start");
        return Frames["Eat"];
    },
    "CookieIntent": (attr: Attributes) => {
        attr.FrameStack.push("Start");
        return Frames["Cookie"];
    },
    "YesIntent": (attr: Attributes) => {
        attr.FrameStack.push("Start");
        return Frames["Cookie"];
    },
    "PurchaseUpgradeIntent": (attr: Attributes) => {
        return Frames["Purchase"];
    },
    "SessionEndedRequest": (attr: Attributes) => {
        console.log("Session ended in start!");
        attr.CurrentFrameId = "Start";
        attr.FrameStack = [];
        delete attr.Model;
        return Frames["Start"];
    }
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Start", entry, unhandled, actionMap);