import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {Items} from "../definitions/Inventory";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    let ovens = ctx.slots["OVENS"];
    let kitchens = ctx.slots["KITCHENS"];

    let item;
    if (ovens && ovens.resolution) {
        if (ovens.resolution.id) {
            item = ovens.resolution.id; // TODO: fetch full name
        } else {
            console.log("Invalid OVENS value: " + ovens.resolution.name);
        }
    } else if (kitchens && kitchens.resolution) {
        if (kitchens.resolution.id) {
            item = kitchens.resolution.id; // TODO: fetch full name
        } else {
            console.log("Invalid KITCHENS value: " + ovens.resolution.name);
        }
    }

    if (item) {
        model.speech = "You bought " + item;
    } else {
        model.speech = "You can't purchase that.";
    }

    model.reprompt = "What else would you like to purchase?";

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": (attr: Attributes) => {
        return Frames["Start"];
    },
    "PurchaseUpgradeIntent": (attr: Attributes) => {
        return Frames["Purchase"];
    },
    "EatCookieIntent": (attr: Attributes) => {
        return Frames["Eat"];
    },
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Purchase", entry, unhandled, actionMap);
