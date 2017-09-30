import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {Items} from "../definitions/Inventory";
import {Humanize} from "../resources/humanize";
import {getNextUpgradeCost} from "../resources/store";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();
    attr.NextUpgrade = getNextUpgradeCost(attr.Inventory);

    if (attr.Upgrades.length > 0) {
        model.speech = "You can purchase: " + attr.Upgrades.map(itemId => {
                let item = Items.All[itemId];

                return item.id;
            }).join(", ") + ". What would you like to purchase?";

        model.reprompt = "What would you like to purchase?";
    } else {
        if (attr.NextUpgrade.greaterThan(0)) {
            model.speech = "There are no items available for purchase right now. The next upgrade is available at " + Humanize(attr.NextUpgrade, 4) + " cookies.";
        } else {
            model.speech = "There are no items available for purchase right now. Bake more cookies!";

        }

        model.reprompt = "You need more cookies.";
    }

    model.cookieCount = attr.CookieCounter;
    model.upgrades = attr.Upgrades;

    attr.Model = model;
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
    "CookieIntent": (attr: Attributes) => {
        return Frames["Cookie"];
    },
    "CheckUpgradesIntent": (attr: Attributes) => {
        return Frames["Store"];
    },
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Store", entry, unhandled, actionMap);