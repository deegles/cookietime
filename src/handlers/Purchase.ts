import * as Big from "bignumber.js";
import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {Items, ItemTypes, Kitchen, Purchaseable} from "../definitions/Inventory";
import {calculateCost} from "../resources/store";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    let ovens = ctx.slots["OVENS"];
    let kitchens = ctx.slots["KITCHENS"];

    let itemId;
    if (ovens && ovens.resolution) {
        if (ovens.resolution.id) {
            itemId = ovens.resolution.id; // TODO: fetch full name
        } else {
            console.log("Invalid OVENS value: " + ovens.resolution.name);
        }
    } else if (kitchens && kitchens.resolution) {
        if (kitchens.resolution.id) {
            itemId = kitchens.resolution.id; // TODO: fetch full name
        } else {
            console.log("Invalid KITCHENS value: " + ovens.resolution.name);
        }
    }

    if (itemId) {
        let allItems: Array<ItemTypes> = [].concat(attr.Inventory.Ovens, attr.Inventory.Kitchen, attr.Inventory.Assistants);
        let item = Items.All[itemId];

        function byRank(a: ItemTypes, b: ItemTypes) {
            return Items.All[b].rank - Items.All[a].rank;
        }

        if (item.type === "Oven") {
            let owned = allItems.filter(invItem => {
                return Items.All[invItem].type === "Oven";
            });

            console.log("owned: " + owned);
            let cost = calculateCost(item, owned.length);
            console.log("cookies: " + attr.CookieCounter);
            console.log("cost: " + cost);

            attr.Inventory.Ovens.push(itemId);
            attr.Inventory.Ovens.sort(byRank);

            let kitchen = Items.All[attr.Inventory.Kitchen] as Kitchen;
            attr.Inventory.Ovens = attr.Inventory.Ovens.slice(0, kitchen.OvenLimit);

            attr.CookieCounter = attr.CookieCounter.minus(cost);

            if (attr.CookieCounter.lessThan(0)) {
                attr.CookieCounter = new Big(0);
                console.log("ERROR: cost was greater than available cookies");
            }
        }

        model.speech = "You now have " + attr.Inventory.Ovens.join(", ");
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
    "CookieIntent": (attr: Attributes) => {
        return Frames["Cookie"];
    }
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Purchase", entry, unhandled, actionMap);
