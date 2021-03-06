import {AlexaRequestBody, AlexaRequestType, IntentRequest} from "../definitions/AlexaService";
import * as Frames from "../definitions/FrameDirectory";
import {Intents, SkillIntents} from "../definitions/Intents";
import {Inventory, Items, ItemTypes} from "../definitions/Inventory";
import {Attributes, RequestContext} from "../definitions/SkillContext";

/**
 * Get the current intent
 * @param event
 * @returns {any}
 */
export function getIntent(event: AlexaRequestBody): SkillIntents {

    let type: AlexaRequestType = event.request.type;
    let intent;

    if (type === "LaunchRequest") {
        intent = "LaunchRequest";
    } else if (type === "SessionEndedRequest") {
        intent = "SessionEndedRequest";
    } else if (type === "IntentRequest") {
        intent = Intents[(event.request as IntentRequest).intent.name];
    }

    if (intent) {
        return intent;
    } else {
        throw new Error("Unknown or unregistered request type: " + JSON.stringify(event.request));
    }
}

export function redirect(attr: Attributes, ctx: RequestContext) {
    let frame = Frames[attr.FrameStack.pop() || "Start"];

    if (ctx.newSession && "NewSession" in frame.actions) {
        frame = frame.actions["NewSession"](attr, ctx);
    } else if (ctx.intent in frame.actions) {
        frame = frame.actions[ctx.intent](attr, ctx);
    } else {
        frame = frame.unhandled(attr, ctx);
    }

    return frame;
}

export function ListInventory(inv: Inventory): string {
    let str = "You now have:\n";

    let allItems: ItemTypes[] = [].concat(inv.Assistants, inv.Kitchen, inv.Ovens);

    let count = {};

    allItems.forEach(itemId => {
        let item = Items.All[itemId];
        let key = (item.id + " " + item.type).toLowerCase();
        key in count ? count[key]++ : count[key] = 1;
    });

    Object.keys(count).forEach(key => {
        str += count[key] + " " + key + ", ";
    });

    return str.slice(0, str.length - 2) + ".";
}

String.prototype.padEnd = function padEnd(targetLength, padString) {
    targetLength = targetLength >> 0; // floor if number or convert non-number to 0;
    padString = String(padString || " ");
    if (this.length > targetLength) {
        return String(this);
    }
    else {
        targetLength = targetLength - this.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
        }
        return String(this) + padString.slice(0, targetLength);
    }
};
