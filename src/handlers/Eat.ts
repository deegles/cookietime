import * as Big from "bignumber.js";
import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import {IntentRequest} from "../definitions/AlexaService";
import {Humanize} from "../resources/humanize";
import {redirect} from "../resources/utilities";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let slots = (ctx.request.request as IntentRequest).intent.slots;

    let eatCount = new Big(1);

    if (slots["quantity"] && slots["quantity"]["value"]) {
        eatCount = new Big(parseInt(slots["quantity"]["value"]));
    }

    let model = new ResponseModel();

    if (eatCount.eq(1) ) {
        attr.CookieCounter = new Big(attr.CookieCounter).minus(1);
        attr.CookiesEaten = new Big(attr.CookiesEaten).plus(1);

        model.speech = `You ate a cookie. You have eaten ${Humanize(attr.CookiesEaten, 3)} cookies.`;
        model.reprompt = `You have ${Humanize(attr.CookieCounter, 3)} cookies left.`;
    } else if (new Big(attr.CookieCounter).lessThanOrEqualTo(eatCount)) {
        attr.CookiesEaten = new Big(attr.CookiesEaten).plus(attr.CookieCounter);
        attr.CookieCounter = new Big(0);

        model.speech = `You ate all your cookies. You have eaten ${Humanize(attr.CookiesEaten, 3)} cookies.`;
        model.reprompt = `You have zero cookies left.`;

    } else if (new Big(attr.CookieCounter).eq(0)) {
        model.speech = `You have no cookies to eat. You have eaten ${Humanize(attr.CookiesEaten, 3)} cookies.`;
        model.reprompt = `You have no cookies left. Bake some more.`;
    } else {
        attr.CookieCounter = new Big(attr.CookieCounter).minus(eatCount);
        attr.CookiesEaten = new Big(attr.CookiesEaten).plus(eatCount);

        model.speech = `You ate ${Humanize(eatCount)} cookies. You have eaten ${Humanize(attr.CookiesEaten, 3)} cookies.`;
        model.reprompt = `You have ${Humanize(attr.CookieCounter, 3)} cookies left.`;
    }

    attr.Model = model;

    return new ResponseContext(model);
};

let actionMap = {};

new Frame("Eat", entry, redirect, actionMap);