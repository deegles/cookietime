import * as Big from "bignumber.js";
import {ActionMap, Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";
import {Humanize} from "../resources/humanize";

import * as Frames from "../definitions/FrameDirectory";
import {getPurchaseableItems} from "../resources/store";


let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    console.log("cookies: " + JSON.stringify(attr.CookieCounter));
    let counter = new Big(attr.CookieCounter).add(1); // TODO: calculate based on inventory per batch and over time

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

let actionMap: ActionMap = {
    "LaunchRequest": (attr: Attributes) => {
        return Frames["Start"];
    },
    "RepeatIntent": (attr: Attributes) => {
        attr.FrameStack.push("Cookie");
        return Frames["Repeat"];
    },
    "EatCookieIntent": (attr: Attributes) => {
        attr.FrameStack.push("Cookie");
        return Frames["Eat"];
    },
    "CookieIntent": (attr: Attributes) => {
        return Frames["Cookie"];
    },
    "YesIntent": (attr: Attributes) => {
        return Frames["Cookie"];
    },
    "NoIntent": (attr: Attributes) => {
        return Frames[attr.FrameStack.pop() || "Start"];
    },
    "CheckUpgradesIntent": (attr: Attributes) => {
        return Frames["Store"];
    },
    "PurchaseUpgradeIntent": (attr: Attributes) => {
        return Frames["Purchase"];
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