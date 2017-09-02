import * as big from "bignumber.js";
import {Inventory, Purchaseable} from "./inventory";

export function getPurchaseableItems(num: big.BigNumber, inventory: Inventory): Array<Purchaseable> {

    return [];
}

export function calculateCost(item: Purchaseable, owned: number): big.BigNumber {
    return new big(item.baseCost).times(new big(item.multiplier).pow(owned));
}
