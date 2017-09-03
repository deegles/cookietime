import * as big from "bignumber.js";
import {Inventory, Items, Purchaseable} from "./inventory";

export function getPurchaseableItems(num: big.BigNumber, inv: Inventory): Array<Purchaseable> {

    let available: Array<Purchaseable> = [];

    for (let ovenId in Items.Ovens) {
        let owned = inv.Ovens.filter(o => {
            return o.id === ovenId;
        });

        let item = Items.Ovens[ovenId];
        let cost = calculateCost(item, owned.length);

        if (cost.lessThanOrEqualTo(num) && canUpgrade(inv, item)) {
            available.push(item);
        }
    }

    return available;
}

export function calculateCost(item: Purchaseable, owned: number): big.BigNumber {
    let cost = new big(item.baseCost).times(new big(item.multiplier).pow(owned));
    return cost.floor();
}

export function canUpgrade(inv: Inventory, item: Purchaseable): boolean {
    let allItems: Array<Purchaseable> = [].concat(inv.Ovens, inv.Kitchen, inv.Assistants);

    return allItems.some(i => {
        return i.type === item.type && i.rank < item.rank;
    });
}