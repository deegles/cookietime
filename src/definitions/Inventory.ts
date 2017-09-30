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
    description: string;
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

export type KitchenTypes =
    "Tiny"
    | "Hobby"
    | "Enthusiast"
    | "Entrepreneur"
    | "Business"
    | "City"
    | "Regional"
    | "National";

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
            description: "an easy bake oven",
            rank: 1
        } as Oven,
        Toaster: {
            baseCost: new Big(10),
            multiplier: 1.07,
            hourlyRate: 4,
            capacity: 2,
            type: "Oven",
            id: "Toaster",
            description: "a toaster oven",
            rank: 2
        } as Oven,
        HomeOven: {
            baseCost: new Big(20),
            multiplier: 1.1,
            hourlyRate: 8,
            capacity: 4,
            type: "Oven",
            id: "HomeOven",
            description: "a home oven",
            rank: 3
        } as Oven,
        Fancy: {
            baseCost: new Big(50),
            multiplier: 1.1,
            hourlyRate: 16,
            capacity: 8,
            type: "Oven",
            id: "Fancy",
            description: "a fancy oven",
            rank: 4
        } as Oven,
        Professional: {
            baseCost: new Big(160),
            multiplier: 1.2,
            hourlyRate: 32,
            capacity: 16,
            type: "Oven",
            id: "Professional",
            description: "a professional oven",
            rank: 5
        } as Oven,
        Industrial: {
            baseCost: new Big(500),
            multiplier: 1.3,
            hourlyRate: 64,
            capacity: 32,
            type: "Oven",
            id: "Industrial",
            description: "an industrial oven",
            rank: 6
        } as Oven,
        Continuous: {
            baseCost: new Big(1000),
            multiplier: 1.5,
            hourlyRate: 128,
            capacity: 64,
            type: "Oven",
            id: "Continuous",
            description: "a continuous oven",
            rank: 7
        } as Oven,
        UpgradedContinuous: {
            baseCost: new Big(2500),
            multiplier: 1.7,
            hourlyRate: 256,
            capacity: 128,
            type: "Oven",
            id: "UpgradedContinuous",
            description: "an upgraded continuous oven",
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
        Tiny: {
            OvenLimit: 2,
            AssistantLimit: 0,
            baseCost: new Big(0),
            multiplier: 0,
            type: "Kitchen",
            id: "Tiny",
            description: "a tiny kitchen",
            rank: 1
        } as Kitchen,
        Hobby: {
            OvenLimit: 3,
            AssistantLimit: 0,
            baseCost: new Big(35),
            multiplier: 1.1,
            type: "Kitchen",
            id: "Hobby",
            description: "a hobby kitchen",
            rank: 2
        } as Kitchen,
        Enthusiast: {
            OvenLimit: 4,
            AssistantLimit: 0,
            baseCost: new Big(150),
            multiplier: 1.1,
            type: "Kitchen",
            id: "Enthusiast",
            description: "an enthusiast kitchen",
            rank: 3
        } as Kitchen,
        Entrepreneur: {
            OvenLimit: 6,
            AssistantLimit: 0,
            baseCost: new Big(350),
            multiplier: 1.1,
            type: "Kitchen",
            id: "Entrepreneur",
            description: "an entrepreneur kitchen",
            rank: 4
        } as Kitchen,
        Business: {
            OvenLimit: 9,
            AssistantLimit: 0,
            baseCost: new Big(1000),
            multiplier: 1.1,
            type: "Kitchen",
            id: "Business",
            description: "a Business kitchen",
            rank: 5
        } as Kitchen,
        City: {
            OvenLimit: 18,
            AssistantLimit: 0,
            baseCost: new Big(3000),
            multiplier: 1.1,
            type: "Kitchen",
            id: "City",
            description: "a city kitchen",
            rank: 6
        } as Kitchen,
        Regional: {
            OvenLimit: 40,
            AssistantLimit: 0,
            baseCost: new Big(10000),
            multiplier: 1.1,
            type: "Kitchen",
            id: "Regional",
            description: "a regional kitchen",
            rank: 7
        } as Kitchen,
        National: {
            OvenLimit: 100,
            AssistantLimit: 0,
            baseCost: new Big(50000),
            multiplier: 1.1,
            type: "Kitchen",
            id: "National",
            description: "a national kitchen",
            rank: 8
        } as Kitchen
    };
}