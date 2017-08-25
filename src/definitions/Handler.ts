import {Context} from "./SkillContext";
let Frames = require("../definitions/FrameDirectory");

namespace Handlers {
    export class FrameDirectory {
        constructor() {

        }

        get(prop): Frame | undefined {
            console.log(`Fetching frame ${prop}, ${prop in this ? "found" : "not found"}.`);
            return this[prop];
        }

        set(prop, value): boolean {
            console.log(`setting frame ${prop}`);

            if (prop in this) {
                throw new Error(`Error, frame ${prop} already exists. All frame IDs must be unique.`);
            }

            return this[prop] = value;
        }
    }

    export class Frame {
        constructor(id: string, entry: ReturnsResponseContext, FrameMap: ActionMap) {
            this.id = id;
            this.entry = entry;
            this.actions = FrameMap;

            Frames[id] = this;
        }

        id: string;

        entry: ReturnsResponseContext;

        actions: ActionMap;
    }

    export class ResponseContext {
        constructor() {

        }

        CurrentFrame: Frame;
        model: ResponseModel;
    }

    export class ResponseModel {
        speech: string;
        reprompt: string;
    }

    export interface ReturnsResponseContext {
        (Context: Context): ResponseContext | Promise<ResponseContext>;
    }

    export interface ActionMap {
        [key: string]: ReturnsFrame | undefined;
    }

    export interface ReturnsFrame {
        (Context: Context): Frame | Promise<Frame>;
    }
}

export = Handlers;