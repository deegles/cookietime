import {BotFrameworkActivity, BotFrameworkAttachment} from "../definitions/BotFrameworkService";
import {ResponseModel} from "../definitions/Handler";
import {Items, Purchaseable} from "../definitions/Inventory";
import {View} from "../definitions/Views";

new View("BotFrameworkActivity", (model: ResponseModel, activity: BotFrameworkActivity) => {

    let CookieAction = {
        text: "Cookie",
        title: "Cookies!",
        type: "postBack",
        value: "bake more cookies",
    };

    let UpgradesAction = {
        text: "Upgrades",
        title: "Check Upgrades",
        type: "postBack",
        value: "check for upgrades",
    };

    let EatAction = {
        text: "eat",
        title: "Eat a Cookie!",
        type: "postBack",
        value: "eat a cookie",
    };

    let HelpAction = {
        text: "Help",
        title: "Help",
        type: "postBack",
        value: "help",
    };

    let card = {
        title: "Cookie Time",
        text: "Tap this card to bake more cookies!",
        tap: CookieAction,
        buttons: [CookieAction]
    };

    if (model.cookieCount) {
        card.title = "Cookie Count: " + model.cookieCount.toFormat(0);
    }

    if (model.upgrades.length > 0) {

        model.upgrades.forEach(upgrade => {
            let item: Purchaseable = Items.All[upgrade];
            card.buttons.push(
                {
                    text: "Upgrade",
                    title: "Buy: " + item.id,
                    type: "postBack",
                    value: item.description,
                }
            );
        });
    } else {
        card.buttons.push(UpgradesAction);
    }

    card.buttons.push(EatAction, HelpAction);

    let Attachment = {
        contentType: "application/vnd.microsoft.card.hero",
        content: card,
        name: "Cookie Card",
    } as BotFrameworkAttachment;

    let response = {
        type: "message",
        from: activity.recipient,
        conversation: activity.conversation,
        locale: activity.locale,
        recipient: activity.from,
        speak: model.speech,
        inputHint: "expectingInput",
        replyToId: activity.id,
        attachments: [Attachment],
    } as BotFrameworkActivity;

    if (activity.channelId === "webchat" && model.upgrades.length < 1) {
        response.text = model.speech;
    }

    return response;
});