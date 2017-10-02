import * as big from "bignumber.js";
import {
    Assistant, AssistantTypes, Inventory, ItemCategories, Items, ItemTypes, Kitchen, KitchenTypes, Oven, OvenTypes,
    Purchaseable
} from "../definitions/Inventory";

export interface PricedItem {
    item: Purchaseable;
    cost: big.BigNumber;
}

export class AvailableItemsForPurchase {
    oven: PricedItem;
    kitchen: PricedItem;
    assistant: PricedItem;
}

export function getPurchaseableItems(cookies: big.BigNumber, inv: Inventory): AvailableItemsForPurchase {

    let available = new AvailableItemsForPurchase();

    let allItems: Array<ItemTypes> = Object.keys(Items.All) as Array<ItemTypes>;

    for (let itemIndex = 0; itemIndex < allItems.length; itemIndex++) {

        let item = Items.All[allItems[itemIndex]] as Purchaseable;

        let cost = calculateCost(item, inv);

        if (cost.lessThanOrEqualTo(cookies) && canPurchase(inv, item)) {
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

export function getNextUpgrades(inv: Inventory): AvailableItemsForPurchase {
    let upgrades = new AvailableItemsForPurchase();

    let oven = Items.All[inv.Ovens.slice(-1).pop()] || Items.All.EasyBake;

    let nextOvenId = Object.keys(Items.All).find(itemId => {
        let item: Purchaseable = Items.All[itemId];
        let slotsAvailable = inv.Ovens.length < (Items.All[inv.Kitchen] as Kitchen).OvenLimit;
        if (slotsAvailable) {
            return item.type === "Oven" && item.rank <= oven.rank; // If slots are available return the lowest rank.
        } else {
            return item.type === "Oven" && item.rank > oven.rank;
        }
    });

    if (nextOvenId) {
        let item: Purchaseable = Items.All[nextOvenId];
        upgrades.oven = {
            item: item,
            cost: calculateCost(item, inv)
        };
    }

    let assistant = Items.All[inv.Assistants.slice(-1).pop()] || Items.All.Junior;

    let nextAssistantId = Object.keys(Items.All).find(itemId => {
        let item: Purchaseable = Items.All[itemId];
        let slotsAvailable = inv.Assistants.length < (Items.All[inv.Kitchen] as Kitchen).AssistantLimit;

        if (slotsAvailable) {
            return item.type === "Assistant" && item.rank <= assistant.rank;
        } else {
            return item.type === "Assistant" && item.rank > assistant.rank;
        }
    });

    if (nextAssistantId) {
        let item: Purchaseable = Items.All[nextAssistantId];
        upgrades.assistant = {
            item: item,
            cost: calculateCost(item, inv)
        };
    }

    let kitchen = Items.All[inv.Kitchen] || Items.All.Tiny;

    let nextKitchenId = Object.keys(Items.All).find(itemId => {
        let item: Purchaseable = Items.All[itemId];
        return item.type === "Kitchen" && kitchen && kitchen.rank && item.rank > kitchen.rank;
    });

    if (nextKitchenId) {
        let item: Purchaseable = Items.All[nextKitchenId];
        upgrades.kitchen = {
            item: item,
            cost: calculateCost(item, inv)
        };
    }

    console.log("next upgrades: " + JSON.stringify(upgrades));

    return upgrades;
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

export function canPurchase(inv: Inventory, item: Purchaseable): boolean {
    let inventoryItems: Array<ItemTypes> = [].concat(inv.Ovens, inv.Kitchen, inv.Assistants);

    let slotsAvailable: boolean = false;

    if (item.type === "Oven") {
        slotsAvailable = inv.Ovens.length < (Items.All[inv.Kitchen] as Kitchen).OvenLimit;
    } else if (item.type === "Assistant") {
        slotsAvailable = inv.Assistants.length < (Items.All[inv.Kitchen] as Kitchen).AssistantLimit && inv.Assistants.length < inv.Ovens.length;
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