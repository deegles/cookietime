import * as Big from "bignumber.js";
import * as Frames from "../definitions/FrameDirectory";
import {AvailableItemsForPurchase} from "../resources/store";
import {Attributes, RequestContext} from "./SkillContext";

export class Frame {
    constructor(id: string, entry: ReturnsResponseContext, unhandled: ReturnsFrame, FrameMap: ActionMap) {
        this.id = id;
        this.entry = entry;
        this.actions = FrameMap;
        this.unhandled = unhandled;

        Frames[id] = this;
    }

    id: string;

    entry: ReturnsResponseContext;

    unhandled: ReturnsFrame;

    actions: ActionMap;
}

export class ResponseContext {
    constructor(model: ResponseModel) {
        this.model = model;
    }

    model: ResponseModel;
}

export class ResponseModel {
    constructor() {
        this.cookieCount = new Big(0);
        this.upgrades = new AvailableItemsForPurchase();
    }

    speech: string;
    reprompt?: string;
    cardText: string;
    cardTitle: string;
    cardSubtitle: string;
    cookieCount: Big.BigNumber;
    upgrades: AvailableItemsForPurchase;
}

export interface ReturnsResponseContext {
    (Attributes: Attributes, Context?: RequestContext): ResponseContext | Promise<ResponseContext>;
}

export interface ActionMap {
    [key: string]: ReturnsFrame | undefined;
}

export interface ReturnsFrame {
    (Attributes: Attributes, Context?: RequestContext): Frame | Promise<Frame>;
}