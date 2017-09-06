import * as big from "bignumber.js";
import {
    Assistant, AssistantTypes, Inventory, Items, ItemTypes, Kitchen, KitchenTypes, Oven, OvenTypes,
    Purchaseable
} from "./inventory";

export function getPurchaseableItems(num: big.BigNumber, inv: Inventory): Array<ItemTypes> {

    let available: Array<ItemTypes> = [];

    let allItems: Array<ItemTypes> = [].concat(inv.Ovens, inv.Kitchen, inv.Assistants);

    for (let itemIndex = 0; itemIndex < allItems.length; itemIndex++) {

        let itemId = allItems[itemIndex];

        let item = Items.All[itemId] as Purchaseable;

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
    let allItems: Array<ItemTypes> = [].concat(inv.Ovens, inv.Kitchen, inv.Assistants);

    let slotsAvailable: boolean = false;

    if (item.type === "Oven") {
        slotsAvailable = inv.Ovens.length < (Items.All[inv.Kitchen] as Kitchen).OvenLimit;
    } else if (item.type === "Assistant") {
        slotsAvailable = inv.Assistants.length < (Items.All[inv.Kitchen] as Kitchen).AssistantLimit;
    }

    let upgradeable: boolean = allItems.some(itemId => {
        let i = Items.All[itemId] as Purchaseable;

        return i.type === item.type && i.rank < item.rank;
    });

    return slotsAvailable || upgradeable;
}