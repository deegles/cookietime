import * as big from "bignumber.js";
import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";
import {Humanize} from "../resources/humanize";

import * as Frames from "../definitions/FrameDirectory";
import {getPurchaseableItems} from "../resources/store";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    console.log("cookies: " + JSON.stringify(attr.CookieCounter));
    let counter: big.BigNumber = new big(attr.CookieCounter).add(1);

    model.speech = `Your cookie count is: ${Humanize(counter, 3)}. `;
    model.reprompt = model.speech;

    attr.CookieCounter = counter;
    attr.Upgrades = getPurchaseableItems(counter, attr.Inventory);

    if (attr.Upgrades.length > 0) {
        model.speech += "There are upgrades available.";
        model.reprompt = "Say 'get upgrades' to hear what is available. ";
    }

    attr.Model = model;

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": (attr: Attributes) => {
        return Frames["Start"];
    },
    "AMAZON.RepeatIntent": (attr: Attributes) => {
        attr.FrameStack.push("Cookie");
        return Frames["Repeat"];
    },
    "CookieIntent": (attr: Attributes) => {
        return Frames["Cookie"];
    },
    "AMAZON.YesIntent": (attr: Attributes) => {
        return Frames["Cookie"];
    },
    "AMAZON.NoIntent": (attr: Attributes) => {
        return Frames[attr.FrameStack.pop() || "Start"];
    },
    "CheckUpgradesIntent": (attr: Attributes) => {
        return Frames["Store"];
    },
    "SessionEndedRequest": (attr: Attributes) => {
        console.log("Session ended in cookie!");
        attr.CurrentFrameId = "Start";
        attr.FrameStack = [];
        delete attr.Model;
        return Frames["Start"];
    }
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Cookie", entry, unhandled, actionMap);