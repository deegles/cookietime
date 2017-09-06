import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {Assistant, ItemCategories, Items, Kitchen, Oven, Purchaseable} from "../definitions/inventory";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    model.speech = "You can purchase: " + attr.Upgrades.map(itemId => {
            let item = Items.All[itemId];

            return item.id;
        }).join(", ");

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": (attr: Attributes) => {
        return Frames["Start"];
    }
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Store", entry, unhandled, actionMap);