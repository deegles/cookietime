import * as Big from "bignumber.js";
import {query} from "../resources/LUIS";
import {AvailableItemsForPurchase} from "../resources/store";
import {getIntent} from "../resources/utilities";
import {AlexaRequestBody, IntentRequest, ResolutionStatus, SessionEndedRequest} from "./AlexaService";
import {BotFrameworkActivity, Intent as BotIntent} from "./BotFrameworkService";
import {ResponseModel} from "./Handler";
import {Intents} from "./Intents";
import {AssistantTypes, Inventory, KitchenTypes, OvenTypes} from "./Inventory";
import {LUISServiceResponse} from "./LUISService";

export interface RequestSlots {
    resolution?: {
        id: string;
        name: string;
    };
    value: string;
    error?: {
        type: string;
        message: string;
    };
}

export interface RequestContext {
    intent: string;

    newSession?: boolean;

    slots: { [Key: string]: RequestSlots };
}

export class AlexaRequestContext implements RequestContext {
    constructor(request: AlexaRequestBody) {

        let intent = getIntent(request);

        this.intent = intent;
        this.slots = {};

        if (request.request.type === "SessionEndedRequest") {
            let req = (request.request as SessionEndedRequest);

            this.slots = {
                "reason": {
                    value: req.reason,
                    error: req.error
                }
            };

        } else if (request.request.type === "IntentRequest") {

            let req = (request.request as IntentRequest);

            if (req.intent.slots) {
                Object.keys(req.intent.slots).forEach(slotName => {

                    let slot = req.intent.slots[slotName];

                    this.slots[slotName] = {
                        value: slot.value
                    };

                    if (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) {
                        // TODO: deal with multiple resolutions
                        let resolution = slot.resolutions.resolutionsPerAuthority[0];
                        if (resolution.status.code === ResolutionStatus.ER_SUCCESS_MATCH) {
                            let value = resolution.values[0].value;
                            this.slots[slotName].resolution = {
                                id: value.id,
                                name: value.name
                            };
                        }
                    }
                });
            }
        }

        this.newSession = request.session && request.session.new;
    }

    newSession: boolean;

    intent: string;

    slots: { [Key: string]: RequestSlots };

    get(prop): any {
        console.log(`Fetching prop ${prop}, ${prop in this ? "found" : "not found"}.`);
        return this[prop];
    }

    set(prop, value): boolean {
        console.log(`Adding prop ${prop}...`);

        return this[prop] = value;
    }

    delete(prop): boolean {
        console.log(`Deleting prop ${prop}...`);

        return delete this[prop];
    }
}

export class CortanaRequestContext implements RequestContext {
    constructor(activity: BotFrameworkActivity, nluResult?: LUISServiceResponse) {
        this.newSession = false;
        this.slots = {};
        let intentName;

        if (nluResult) {
            intentName = Intents[nluResult.topScoringIntent.intent];

            if (intentName) {
                this.intent = intentName;
            } else {
                throw new Error("Unknown or unregistered intent: " + nluResult.topScoringIntent.intent);
            }

            // TODO: deal with multiple entities/values
            let entity = nluResult.entities[0];

            console.log("entity: " + JSON.stringify(entity));

            if (entity) {
                let value = entity.resolution.value;

                if (entity.resolution.values) {
                    let values = entity.resolution.values;
                    value = values ? values[0] : undefined;
                }

                // Translate builtin type names to expected slot names
                if (entity.type === "builtin.number" && intentName === "EatCookieIntent") {
                    entity.type = "quantity";
                }

                this.slots[entity.type] = {
                    resolution: {
                        id: value,
                        name: entity.type
                    },
                    value: value // TODO: check if entity.entity should be used instead
                };

            }
        } else {
            let intentObj = activity.entities.filter(entity => {
                return entity.type = "Intent";
            }).shift() as BotIntent;

            intentName = Intents[intentObj.name];

            if (intentName) {
                this.intent = intentName;
            } else {
                throw new Error("Unknown or unregistered intent: " + intentObj.name);
            }
        }
    }

    intent: string;
    slots: { [p: string]: RequestSlots };
    newSession: boolean;

}

export class Attributes {
    constructor(props?: any) {
        this.FrameStack = [];
        this.CookieCounter = new Big("0");
        this.CookiesEaten = new Big("0");
        this.NextUpgrades = new AvailableItemsForPurchase();
        this.CurrentFrameId = "Start";
        this.Upgrades = new AvailableItemsForPurchase();
        this.Inventory = {
            Kitchen: "Tiny",
            Ovens: ["EasyBake"],
            Assistants: [],
            LastActionTime: new Date().getTime()
        };

        if (props) {
            Object.assign(this, props);
        }

        if (!this.CookieCounter.isBigNumber) {
            this.CookieCounter = new Big(this.CookieCounter);
        }

        if (!this.CookiesEaten.isBigNumber) {
            this.CookiesEaten = new Big(this.CookiesEaten);
        }

        if (this.NextUpgrades.kitchen && this.NextUpgrades.kitchen.cost) {
            this.NextUpgrades.kitchen.cost = new Big(this.NextUpgrades.kitchen.cost);
        }

        if (this.NextUpgrades.oven && this.NextUpgrades.oven.cost) {
            this.NextUpgrades.oven.cost = new Big(this.NextUpgrades.oven.cost);
        }

        if (this.NextUpgrades.assistant && this.NextUpgrades.assistant.cost) {
            this.NextUpgrades.assistant.cost = new Big(this.NextUpgrades.assistant.cost);
        }

    }

    FrameStack: Array<string>;

    CurrentFrameId: string;

    CookieCounter: Big.BigNumber;

    CookiesEaten: Big.BigNumber;

    Model: ResponseModel;

    Inventory: Inventory;

    Upgrades: AvailableItemsForPurchase;

    NextUpgrades: AvailableItemsForPurchase;

    get(prop: string): any {
        console.log(`Fetching prop ${prop}, ${prop in this ? "found" : "not found"}.`);

        return this[prop];
    }

    set(prop: string, value: any): boolean {
        console.log(`Adding prop ${prop}...`);

        return this[prop] = value;
    }

    delete(prop): boolean {
        console.log(`Deleting prop ${prop}...`);

        return delete this[prop];
    }
}