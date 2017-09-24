import * as Big from "bignumber.js";
import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {Items, ItemTypes, Kitchen, Purchaseable} from "../definitions/Inventory";
import {calculateCost, getPurchaseableItems} from "../resources/store";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    let ovens = ctx.slots["OVENS"];
    let kitchens = ctx.slots["KITCHENS"];

    console.log("Context: " + JSON.stringify(ctx));
    console.log("Inventory: " + JSON.stringify(attr.Inventory));

    let itemId;
    let unresolvedItem = false;
    if (ovens && ovens.resolution) {
        if (ovens.resolution.id) {
            itemId = ovens.resolution.id; // TODO: fetch full name
        } else {
            unresolvedItem = true;
            console.log("Invalid OVENS value: " + ovens.resolution.name);
        }
    } else if (kitchens && kitchens.resolution) {
        if (kitchens.resolution.id) {
            itemId = kitchens.resolution.id; // TODO: fetch full name
        } else {
            unresolvedItem = true;
            console.log("Invalid KITCHENS value: " + ovens.resolution.name);
        }
    }

    if (itemId) {
        let allItems: Array<ItemTypes> = [].concat(attr.Inventory.Ovens, attr.Inventory.Kitchen, attr.Inventory.Assistants);
        let candidate = Items.All[itemId];

        function byRank(a: ItemTypes, b: ItemTypes) {
            return Items.All[b].rank - Items.All[a].rank;
        }

        let cost = calculateCost(candidate, attr.Inventory);
        console.log("cookies: " + attr.CookieCounter);
        console.log("cost: " + cost);

        let kitchen = Items.All[attr.Inventory.Kitchen] as Kitchen;

        let ovensBelowItemRank = attr.Inventory.Ovens.some(invItem => {
            let t = Items.All[invItem];
            console.log("Item: " + candidate.id + " : " + candidate.rank);
            console.log("inv: " + t.id + " : " + t.rank);
            return t.type === candidate.type && t.rank < candidate.rank;
        });

        let assistantsBelowItemRank = attr.Inventory.Assistants.some(invItem => {
            let t = Items.All[invItem];
            return t.type === candidate.type && t.rank < candidate.rank;
        });

        let ovenSpaceFull = !ovensBelowItemRank && candidate.type === "Oven" && attr.Inventory.Ovens.length >= kitchen.OvenLimit;
        let assistantSpaceFull = !assistantsBelowItemRank && candidate.type === "Assistant" && attr.Inventory.Assistants.length >= kitchen.AssistantLimit;

        if (ovensBelowItemRank && assistantsBelowItemRank) {
            model.speech = "You already have better items.";
        } else if (ovenSpaceFull || assistantSpaceFull) {
            model.speech = "You don't have room for that.";
        } else if (attr.CookieCounter.lessThan(cost)) {
            console.log("ERROR: oven cost was greater than available cookies");
            model.speech = "You don't have enough cookies to purchase that. ";
        } else if (candidate.type === "Oven") {
            attr.Inventory.Ovens.push(itemId);
            attr.Inventory.Ovens.sort(byRank);

            attr.Inventory.Ovens = attr.Inventory.Ovens.slice(0, kitchen.OvenLimit);

            attr.CookieCounter = attr.CookieCounter.minus(cost);
            attr.Upgrades = getPurchaseableItems(attr.CookieCounter, attr.Inventory);
            model.speech = "You now have " + attr.Inventory.Ovens.join(", ");

        } else if (candidate.type === "Kitchen") {

            attr.Inventory.Kitchen = itemId;

            attr.CookieCounter = attr.CookieCounter.minus(cost);
            attr.Upgrades = getPurchaseableItems(attr.CookieCounter, attr.Inventory);
            model.speech = "You now have " + attr.Inventory.Ovens.join(", ");
        }

    } else {
        model.speech = unresolvedItem ? "You can't purchase that." : "What would you like to purchase?";
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
