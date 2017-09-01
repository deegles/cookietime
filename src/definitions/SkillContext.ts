import {Callback, Context as LambdaContext} from "aws-lambda";
import * as big from "bignumber.js";
import {AlexaRequestBody} from "./AlexaService";

export class RequestContext {
    constructor(request: AlexaRequestBody, event: LambdaContext, callback: Callback) {
        this.request = request;
        this.event = event;
        this.callback = callback;
    }

    request: AlexaRequestBody;

    event: LambdaContext;

    callback: Callback;

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
        this.CookieCounter = new big("0");
        this.CurrentFrameId = "Start";


        if (props) {
            Object.assign(this, props);
        }

    }

    FrameStack: Array<string>;

    CurrentFrameId: string;

    CookieCounter: big.BigNumber;

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