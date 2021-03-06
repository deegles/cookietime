import {BotFrameworkActivity, BotFrameworkAttachment} from "../definitions/BotFrameworkService";
import {ResponseModel} from "../definitions/Handler";
import {Items, Purchaseable} from "../definitions/Inventory";
import {View} from "../definitions/Views";

new View("BotFrameworkActivity", (model: ResponseModel, activity: BotFrameworkActivity) => {

    let card = {
        title: "Cookie Time",
        text: "Tap this card to bake more cookies!",
        tap: CookieAction,
        buttons: [CookieAction]
    };

    if (model.cookieCount) {
        card.title = "Cookie Count: " + model.cookieCount.toFormat(0);
    }

    if (model.cardText) {
        card.text = model.cardText;
    }

    if (model.cardSubtitle) {
        card["subtitle"] = model.cardSubtitle;
    }

    if (model.cardTitle) {
        card.title = model.cardTitle;
    }

    if (Object.keys(model.upgrades).length > 0) {

        Object.keys(model.upgrades).forEach(key => {
            let upgrade = model.upgrades[key];
            card.buttons.push(
                {
                    text: "Upgrade",
                    title: "Buy " + (upgrade.item.id + " " + upgrade.item.type).toLowerCase() + ": " + upgrade.cost + " cookies.",
                    type: "postBack",
                    value: "buy " + upgrade.item.description,
                }
            );
        });
    }

    card.buttons.push(UpgradesAction, EatAction, HelpAction);

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

    if (activity.channelId === "webchat") {
        // Reverse so that cookies button stays in place for clicking
        card.buttons.reverse();
    }

    return response;
});

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