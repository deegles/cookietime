import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {AlexaRequestContext, Attributes} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";

let entry = (attr: Attributes, ctx: AlexaRequestContext) => {

    let model = new ResponseModel();

    model.speech = "It's Cookie Time. You have to bake as many cookies as you can. Say 'cookie' to bake cookies. Purchase upgrades to bake cookies more quickly. ";
    model.speech += "Assistants can bake cookies while you're not around. Perfect cookies are rare, and can be traded for better upgrades! ";
    model.speech += "By the way, you can never eat too many cookies...";
    model.reprompt = "Say 'check upgrades' for advice, then say the name of the item you want. ";
    model.cardText = model.speech;
    model.cookieCount = attr.CookieCounter;

    attr.Model = model;

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": (attr: Attributes) => {
        return Frames["Start"];
    },
    "RepeatIntent": (attr: Attributes) => {
        attr.FrameStack.push("Help");
        return Frames["Repeat"];
    },
    "HelpIntent": (attr: Attributes) => {
        return Frames["Help"];
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
    "CheckUpgradesIntent": (attr: Attributes) => {
        return Frames["Store"];
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

new Frame("Help", entry, unhandled, actionMap);