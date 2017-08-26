import {Callback, Context as LambdaContext} from "aws-lambda";
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
        if (props) {
            Object.assign(this, props);
        }
    }

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