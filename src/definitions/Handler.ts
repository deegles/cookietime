import {Context} from "./SkillContext";
let Frames = require("../definitions/FrameDirectory");

namespace Handlers {

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
        constructor(model: ResponseModel) {
            this.model = model;
        }

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