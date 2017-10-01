import * as big from "bignumber.js";
import {
    Assistant, AssistantTypes, Inventory, Items, ItemTypes, Kitchen, KitchenTypes, Oven, OvenTypes,
    Purchaseable
} from "../definitions/Inventory";

export interface ItemForPurchase {
    item: Purchaseable;
    cost: big.BigNumber;
}

export class AvailableItemsForPurchase {
    oven: ItemForPurchase;
    kitchen: ItemForPurchase;
    assistant: ItemForPurchase;
}

export function getPurchaseableItems(cookies: big.BigNumber, inv: Inventory): AvailableItemsForPurchase {

    let available = new AvailableItemsForPurchase();

    let allItems: Array<ItemTypes> = Object.keys(Items.All) as Array<ItemTypes>;

    for (let itemIndex = 0; itemIndex < allItems.length; itemIndex++) {

        let item = Items.All[allItems[itemIndex]] as Purchaseable;

        let cost = calculateCost(item, inv);

        if (cost.lessThanOrEqualTo(cookies) && canUpgrade(inv, item)) {
            if (item.type === "Oven") {
                available.oven = {
                    item: item,
                    cost: cost
                };
            } else if (item.type === "Kitchen") {
                available.kitchen = {
                    item: item,
                    cost: cost
                };
            } else {
                available.assistant = {
                    item: item,
                    cost: cost
                };
            }
        }
    }

    return available;
}

export function getNextUpgradeCost(inv: Inventory): big.BigNumber {
    let cost = new big(-1);
    let available: Array<big.BigNumber> = [];
    let allItems: Array<ItemTypes> = Object.keys(Items.All) as Array<ItemTypes>;

    for (let i = 0; i < 25; i++) {
        let target = new big(10).pow(i);

        for (let itemIndex = 0; itemIndex < allItems.length; itemIndex++) {

            let item = Items.All[allItems[itemIndex]] as Purchaseable;

            let cost = calculateCost(item, inv);

            if (cost.lessThanOrEqualTo(target) && canUpgrade(inv, item)) {
                available.push(cost);
            }
        }

        if (available.length > 0) {
            break;
        }
    }

    available.sort(byBigNumber);
    console.log("available: " + JSON.stringify(available));

    return available.pop() || cost;
}

export function calculateCost(item: Purchaseable, inv: Inventory): big.BigNumber {
    let itemsInInventory = [].concat(inv.Ovens, inv.Kitchen, inv.Assistants).filter(i => {
        return Items.All[i].type === item.type;
    });

    let rankSum = itemsInInventory.reduce((prev, curr) => {
        return prev + Items.All[curr].rank;
    }, 0);

    let cost = new big(item.baseCost).times(new big(item.multiplier).pow(itemsInInventory.length + rankSum));
    return cost.floor();
}

export function canUpgrade(inv: Inventory, item: Purchaseable): boolean {
    let inventoryItems: Array<ItemTypes> = [].concat(inv.Ovens, inv.Kitchen, inv.Assistants);

    let slotsAvailable: boolean = false;

    if (item.type === "Oven") {
        slotsAvailable = inv.Ovens.length < (Items.All[inv.Kitchen] as Kitchen).OvenLimit;
    } else if (item.type === "Assistant") {
        slotsAvailable = inv.Assistants.length < (Items.All[inv.Kitchen] as Kitchen).AssistantLimit;
    }

    let upgradeable: boolean = inventoryItems.some(itemId => {
        let invItem = Items.All[itemId] as Purchaseable;
        return invItem.type === item.type && invItem.rank < item.rank;
    });


    return slotsAvailable || upgradeable;
}

function byBigNumber(a: big.BigNumber, b: big.BigNumber): number {
    if (a.greaterThan(b)) {
        return -1;
    } else if (a.lessThan(b)) {
        return 1;
    } else {
        return 0;
    }
}