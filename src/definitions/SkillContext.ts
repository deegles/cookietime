import {Callback, Context} from "aws-lambda";
import {AlexaRequestBody} from "./AlexaService";

namespace Skill {
    export class Context {
        constructor(request: AlexaRequestBody, event: Context, callback: Callback, _this?: any) {
            if (_this) {
                Object.assign(this, _this);
            }

            this.request = request;
            this.event = event;
            this.callback = callback;
        }

        request: AlexaRequestBody;

        event: Context;

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
}

export = Skill;
