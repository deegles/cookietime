import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {Items} from "../definitions/Inventory";
import {Humanize} from "../resources/humanize";
import {getNextUpgrades, PricedItem} from "../resources/store";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();
    attr.NextUpgrades = getNextUpgrades(attr.Inventory);

    model.speech = `There are no items available for purchase right now.`;

    let upgradeKeys = Object.keys(attr.NextUpgrades);
    if (upgradeKeys.length > 0) {
        upgradeKeys.sort((aKey, bKey) => {
            let a = attr.NextUpgrades[aKey] as PricedItem;
            let b = attr.NextUpgrades[bKey] as PricedItem;
            if (a.cost.greaterThan(b.cost)) {
                return 1;
            } else if (a.cost.lessThan(b.cost)) {
                return -1;
            }
            return 0;
        });

        let upgrade = attr.NextUpgrades[upgradeKeys[0]] as PricedItem;

        model.speech += ` The next ${upgrade.item.type} upgrade is available at ${Humanize(upgrade.cost, 4)} cookies.`;

        model.cardText = "Keep baking cookies to buy the next upgrade! ";

        upgradeKeys.forEach(key => {
            let upgrade = attr.NextUpgrades[key] as PricedItem;

            model.cardText += `Next ${upgrade.item.type}: ${upgrade.cost} cookies. \n`;
        });

    } else {
        model.speech = "There are no items available for purchase right now. Bake more cookies!";
    }

    if (Object.keys(attr.Upgrades).length > 0) {
        model.speech = "You can purchase: " + Object.keys(attr.Upgrades).map(upgrade => {
            let item = attr.Upgrades[upgrade].item;

            return item.id;
        }).join(", ") + ". What would you like to purchase?";

        model.reprompt = "What would you like to purchase?";
    }

    model.reprompt = "You need more cookies.";


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