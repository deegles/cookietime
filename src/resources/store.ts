import * as big from "bignumber.js";
import {
    Assistant, AssistantTypes, Inventory, Items, Kitchen, KitchenTypes, Oven, OvenTypes,
    Purchaseable
} from "./inventory";

export function getPurchaseableItems(num: big.BigNumber, inv: Inventory): Array<KitchenTypes | AssistantTypes | OvenTypes> {

    let available: Array<KitchenTypes | AssistantTypes | OvenTypes> = [];

    let allItems: Array<KitchenTypes | AssistantTypes | OvenTypes> = [].concat(inv.Ovens, inv.Kitchen, inv.Assistants);

    for (let itemIndex = 0; itemIndex < allItems.length; itemIndex++) {

        let itemId = allItems[itemIndex];

        console.log("Itemid:" + itemId);

        let item;

        itemId in Items.Ovens ? item = Items.Ovens[itemId] as Oven : undefined;
        itemId in Items.Kitchens ? item = Items.Kitchens[itemId] as Kitchen : undefined;
        itemId in Items.Assistants ? item = Items.Assistants[itemId] as Assistant : undefined;

        console.log("item: " + JSON.stringify(item));

        let owned = allItems.filter(invItem => {
            return invItem === itemId;
        });

        console.log("owned: " + JSON.stringify(owned));

        let cost = calculateCost(item, owned.length);

        if (cost.lessThanOrEqualTo(num) && canUpgrade(inv, item)) {
            available.push(itemId);
        }
    }

    return available;
}

export function calculateCost(item: Purchaseable, owned: number): big.BigNumber {
    let cost = new big(item.baseCost).times(new big(item.multiplier).pow(owned));
    return cost.floor();
}

export function canUpgrade(inv: Inventory, item: Purchaseable): boolean {
    let allItems: Array<KitchenTypes | AssistantTypes | OvenTypes> = [].concat(inv.Ovens, inv.Kitchen, inv.Assistants);

    let slotsAvailable: boolean = false;

    if (item.type === "Oven") {
        slotsAvailable = inv.Ovens.length < Items.Kitchens[inv.Kitchen].OvenLimit;
    } else if (item.type === "Assistant") {
        slotsAvailable = inv.Assistants.length < Items.Kitchens[inv.Kitchen].AssistantLimit;
    }

    let upgradeable: boolean = allItems.some(itemId => {
        let i;

        itemId in Items.Ovens ? i = Items.Ovens[itemId] as Oven : undefined;
        itemId in Items.Kitchens ? i = Items.Kitchens[itemId] as Kitchen : undefined;
        itemId in Items.Assistants ? i = Items.Assistants[itemId] as Assistant : undefined;

        return i.type === item.type && i.rank < item.rank;
    });

    return slotsAvailable || upgradeable;
}