import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import {redirect} from "../resources/utilities";

let entry = (attr: Attributes, ctx: RequestContext) => {

    if (attr.Model) {
        return new ResponseContext(attr.Model);
    }

    let model = new ResponseModel();

    model.speech = `There is nothing to repeat.`;
    model.reprompt = model.speech;

    return new ResponseContext(model);
};

let actionMap = {};

new Frame("Repeat", entry, redirect, actionMap);
