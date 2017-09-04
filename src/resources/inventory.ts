import Big = require("bignumber.js");

export interface Inventory {
    Kitchen: KitchenTypes;
    Ovens: Array<OvenTypes>;
    Assistants: Array<AssistantTypes>;
}

export interface Purchaseable {
    baseCost: Big.BigNumber;
    multiplier: number;
    type: ItemType;
    rank: number;
}

export interface Kitchen extends Purchaseable {
    OvenLimit: number;
    AssistantLimit: number;
    id: KitchenTypes;
}

export interface Oven extends Purchaseable {
    hourlyRate: number;
    capacity: number;
    id: OvenTypes;
}

export interface Assistant extends Purchaseable {
    duration: number;
}

export type ItemType = "Oven" | "Assistant" | "Kitchen";
export type OvenTypes = "EasyBake" | "HomeOven";
export type AssistantTypes = "PartTime";
export type KitchenTypes = "Hobby";

export class Items {
    static Ovens: {[Key in OvenTypes]: Oven} = {
        EasyBake: {
            baseCost: new Big(25),
            multiplier: 1.03,
            hourlyRate: 2,
            capacity: 1,
            type: "Oven",
            id: "EasyBake",
            rank: 1
        },
        HomeOven: {
            baseCost: new Big(100),
            multiplier: 1.1,
            hourlyRate: 8,
            capacity: 4,
            type: "Oven",
            id: "HomeOven",
            rank: 2
        }
    };

    static Assistants: {[Key in AssistantTypes]: Assistant} = {
        PartTime: {
            baseCost: new Big(100),
            multiplier: 1.07,
            type: "Assistant",
            rank: 1,
            duration: 1
        }
    };

    static Kitchens: {[Key in KitchenTypes]: Kitchen} = {
        Hobby: {
            OvenLimit: 2,
            AssistantLimit: 0,
            baseCost: new Big(0),
            multiplier: 0,
            type: "Kitchen",
            id: "Hobby",
            rank: 1
        }
    };
}