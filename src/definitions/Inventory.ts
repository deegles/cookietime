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
export type OvenTypes =
    "EasyBake"
    | "Fancy"
    | "Toaster"
    | "HomeOven"
    | "Professional"
    | "Industrial"
    | "Continuous"
    | "UpgradedContinuous";
export type AssistantTypes = "PartTime";
export type KitchenTypes = "Hobby";
export type ItemTypes = OvenTypes | AssistantTypes | KitchenTypes;

export class Items {
    static All: {[Key in ItemTypes]: Purchaseable } = {
        /**
         * Ovens
         */
        EasyBake: {
            baseCost: new Big(5),
            multiplier: 1.07,
            hourlyRate: 2,
            capacity: 1,
            type: "Oven",
            id: "EasyBake",
            rank: 1
        } as Oven,
        Toaster: {
            baseCost: new Big(10),
            multiplier: 1.07,
            hourlyRate: 4,
            capacity: 2,
            type: "Oven",
            id: "Toaster",
            rank: 2
        } as Oven,
        HomeOven: {
            baseCost: new Big(20),
            multiplier: 1.1,
            hourlyRate: 8,
            capacity: 4,
            type: "Oven",
            id: "HomeOven",
            rank: 3
        } as Oven,
        Fancy: {
            baseCost: new Big(50),
            multiplier: 1.1,
            hourlyRate: 16,
            capacity: 8,
            type: "Oven",
            id: "Fancy",
            rank: 4
        } as Oven,
        Professional: {
            baseCost: new Big(160),
            multiplier: 1.2,
            hourlyRate: 32,
            capacity: 16,
            type: "Oven",
            id: "Professional",
            rank: 5
        } as Oven,
        Industrial: {
            baseCost: new Big(500),
            multiplier: 1.3,
            hourlyRate: 64,
            capacity: 32,
            type: "Oven",
            id: "Industrial",
            rank: 6
        } as Oven,
        Continuous: {
            baseCost: new Big(1000),
            multiplier: 1.5,
            hourlyRate: 128,
            capacity: 64,
            type: "Oven",
            id: "Continuous",
            rank: 7
        } as Oven,
        UpgradedContinuous: {
            baseCost: new Big(2500),
            multiplier: 1.7,
            hourlyRate: 256,
            capacity: 128,
            type: "Oven",
            id: "UpgradedContinuous",
            rank: 8
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