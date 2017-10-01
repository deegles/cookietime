import * as Big from "bignumber.js";
import {ActionMap, Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Assistant, Inventory, Items, Oven} from "../definitions/Inventory";
import {Attributes, RequestContext} from "../definitions/SkillContext";
import {Humanize} from "../resources/humanize";

import * as Frames from "../definitions/FrameDirectory";
import {getNextUpgradeCost, getPurchaseableItems} from "../resources/store";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    let cookiesPerAction = getCookiesPerAction(attr.Inventory);
    let cookiesSinceAction = getAssistantBakedCookies(attr.Inventory);

    attr.Inventory.LastActionTime = new Date().getTime();

    let counter = new Big(attr.CookieCounter).add(cookiesPerAction).add(cookiesSinceAction);

    model.speech = `Your cookie count is: ${Humanize(counter, 3)}. `;
    model.reprompt = model.speech;

    attr.CookieCounter = counter;
    attr.Upgrades = getPurchaseableItems(counter, attr.Inventory);
    attr.NextUpgrade = getNextUpgradeCost(attr.Inventory);

    if (Object.keys(attr.Upgrades).length > 0) {
        model.speech += "There are upgrades available.";
        model.reprompt = "Say 'get upgrades' to hear what is available. ";
    }

    model.cookieCount = attr.CookieCounter;
    model.upgrades = attr.Upgrades;

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

function getCookiesPerAction(inv: Inventory): Big.BigNumber {
    let total = new Big(0);

    inv.Ovens.forEach(ovenId => {
        let oven = Items.All[ovenId] as Oven;
        total = total.add(oven.capacity);
    });

    console.log("Action baked %s cookies.", total);

    return total;
}

function getAssistantBakedCookies(inv: Inventory): Big.BigNumber {
    let total = new Big(0);

    let ovens = inv.Ovens.slice().reverse();
    let assistants = inv.Assistants.slice().reverse();

    console.log("Ovens: " + ovens);
    console.log("Assistants: " + assistants );
    let now = new Date().getTime();

    while (assistants.length > 0 && ovens.length > 0 && assistants.length <= ovens.length) {
        let assistant = Items.All[assistants.pop()] as Assistant;
        let oven = Items.All[ovens.pop()] as Oven;

        let hours = new Big(now - inv.LastActionTime).div(1000 * 60 * 60);

        total = total.add((Big.min(assistant.duration, hours).times(oven.hourlyRate)).trunc());
    }

    console.log("Assistants baked %s cookies.", total);

    return total;
}