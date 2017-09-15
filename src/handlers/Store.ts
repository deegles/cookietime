import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {Items} from "../definitions/Inventory";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    model.speech = "You can purchase: " + attr.Upgrades.map(itemId => {
            let item = Items.All[itemId];

            return item.id;
        }).join(", ") + ". What would you like to purchase?";

    model.reprompt = "What would you like to purchase?";

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

new Frame("Store", entry, unhandled, actionMap);