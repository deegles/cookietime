import * as big from "bignumber.js";
import {
    Assistant, AssistantTypes, Inventory, Items, ItemTypes, Kitchen, KitchenTypes, Oven, OvenTypes,
    Purchaseable
} from "../definitions/Inventory";

export function getPurchaseableItems(num: big.BigNumber, inv: Inventory): Array<ItemTypes> {

    let available: Array<ItemTypes> = [];

    let allItems: Array<ItemTypes> = Object.keys(Items.All) as Array<ItemTypes>;

    for (let itemIndex = 0; itemIndex < allItems.length; itemIndex++) {

        let item = Items.All[allItems[itemIndex]] as Purchaseable;

        let owned = [].concat(inv.Ovens, inv.Assistants).filter(invItem => {
            return Items.All[invItem].type === item.type; // TODO: refactor into helper function
        });

        let cost = calculateCost(item, owned.length);

        if (cost.lessThanOrEqualTo(num) && canUpgrade(inv, item)) {
            available.push(item.id);
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
        let invItem = Items.All[itemId] as Purchaseable;
        return invItem.type === item.type && invItem.rank < item.rank;
    });

    return slotsAvailable || upgradeable;
}