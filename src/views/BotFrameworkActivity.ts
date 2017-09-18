import {BotFrameworkActivity} from "../definitions/BotFrameworkService";
import {ResponseModel} from "../definitions/Handler";
import {View} from "../definitions/Views";

new View("BotFrameworkActivity", (model: ResponseModel, activity: BotFrameworkActivity) => {

    let response = {
        "type": "message",
        "from": activity.recipient,
        "conversation": activity.conversation,
        "locale": activity.locale,
        "recipient": activity.from,
        "text":  model.speech,
        "speak": model.speech,
        "inputHint": "expectingInput",
        "replyToId": activity.id
    } as BotFrameworkActivity;

    return response;
});