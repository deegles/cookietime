import {AlexaRequestBody, AlexaRequestType, IntentRequest} from "../definitions/AlexaService";

/**
 * Get the current intent
 * @param event
 * @returns {any}
 */
export function getIntent(event: AlexaRequestBody): string {

    let type: AlexaRequestType = event.request.type;

    if (type === "LaunchRequest") {
        return "LaunchRequest";
    } else if (type === "SessionEndedRequest") {
        return "SessionEndedRequest";
    } else if (type === "IntentRequest") {
        return (event.request as IntentRequest).intent.name;
    } else {
        throw new Error("Unknown request type: " + JSON.stringify(event.request));
    }
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
