export interface Inventory {
    Kitchen: Kitchen;
    Ovens: Array<Oven>;
    Assistants: Array<Assistant>;
}

export interface Purchaseable {
    baseCost: number;
    multiplier: number;
    type: ItemType;
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

export type ItemType = "Oven" | "Assistant" | "Kitchen";
export type OvenTypes = "EasyBake" | "HomeOven";
export type KitchenTypes = "Hobby";

export class Items {
    static Ovens: {[Key in OvenTypes]: Oven} = {
        EasyBake: {
            baseCost: 25,
            multiplier: 1.03,
            hourlyRate: 1,
            capacity: 1,
            type: "Oven"
        },
        HomeOven: {
            baseCost: 100,
            multiplier: 1.1,
            hourlyRate: 1,
            capacity: 1,
            type: "Oven"
        }
    };

    // static Assistants

    static Kitchens: {[Key in KitchenTypes]: Kitchen} = {
        Hobby: {
            OvenLimit: 1,
            AssistantLimit: 1,
            baseCost: 0,
            multiplier: 0,
            type: "Kitchen"
        }
    };
}

