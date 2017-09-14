import {Callback, Context as LambdaContext} from "aws-lambda";
import * as Big from "bignumber.js";
import {getIntent} from "../resources/utilities";
import {AlexaRequestBody, IntentRequest, ResolutionStatus, SessionEndedRequest} from "./AlexaService";
import {ResponseModel} from "./Handler";
import {AssistantTypes, Inventory, KitchenTypes, OvenTypes} from "./Inventory";

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
    constructor(request: AlexaRequestBody, event: LambdaContext, callback: Callback) {

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

export class Attributes {
    constructor(props?: any) {
        this.FrameStack = [];
        this.CookieCounter = new Big("0");
        this.CookiesEaten = new Big("0");
        this.CurrentFrameId = "Start";
        this.Upgrades = [];
        this.Inventory = {
            Kitchen: "Hobby",
            Ovens: ["EasyBake"],
            Assistants: []
        };

        if (props) {
            Object.assign(this, props);
        }

    }

    FrameStack: Array<string>;

    CurrentFrameId: string;

    CookieCounter: Big.BigNumber;

    CookiesEaten: Big.BigNumber;

    Model: ResponseModel;

    Inventory: Inventory;

    Upgrades: Array<KitchenTypes | AssistantTypes | OvenTypes>;

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