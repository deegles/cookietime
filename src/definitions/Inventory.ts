import Big = require("bignumber.js");

export interface Inventory {
    Kitchen: KitchenTypes;
    Ovens: Array<OvenTypes>;
    Assistants: Array<AssistantTypes>;
}

export interface Purchaseable {
    baseCost: Big.BigNumber;
    multiplier: number;
    type: ItemCategories;
    rank: number;
    id: ItemTypes;
}

export interface Kitchen extends Purchaseable {
    OvenLimit: number;
    AssistantLimit: number;
}

export interface Oven extends Purchaseable {
    hourlyRate: number;
    capacity: number;
}

export interface Assistant extends Purchaseable {
    duration: number;
}

export type ItemCategories = "Oven" | "Assistant" | "Kitchen";
export type OvenTypes = "EasyBake" | "HomeOven";
export type AssistantTypes = "PartTime";
export type KitchenTypes = "Hobby";
export type ItemTypes = OvenTypes | AssistantTypes | KitchenTypes;

export class Items {
    static All: {[Key in ItemTypes]: Purchaseable } = {
        /**
         * Ovens
         */
        EasyBake: {
            baseCost: new Big(25),
            multiplier: 1.03,
            hourlyRate: 2,
            capacity: 1,
            type: "Oven",
            id: "EasyBake",
            rank: 1
        } as Oven,
        HomeOven: {
            baseCost: new Big(100),
            multiplier: 1.1,
            hourlyRate: 8,
            capacity: 4,
            type: "Oven",
            id: "HomeOven",
            rank: 2
        } as Oven,
        /**
         * Assistants
         */
        PartTime: {
            baseCost: new Big(100),
            multiplier: 1.07,
            type: "Assistant",
            rank: 1,
            duration: 1,
            id: "PartTime"
        } as Assistant,
        /**
         * Kitchens
         */
        Hobby: {
            OvenLimit: 2,
            AssistantLimit: 0,
            baseCost: new Big(0),
            multiplier: 0,
            type: "Kitchen",
            id: "Hobby",
            rank: 1
        } as Kitchen,
    };
}