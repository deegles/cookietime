import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {Assistant, Items, ItemType, Kitchen, Oven} from "../resources/inventory";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    model.speech = "You can purchase: " + attr.Upgrades.map(itemId => {
            let item;

            itemId in Items.Ovens ? item = Items.Ovens[itemId] as Oven : undefined;
            itemId in Items.Kitchens ? item = Items.Kitchens[itemId] as Kitchen : undefined;
            itemId in Items.Assistants ? item = Items.Assistants[itemId] as Assistant : undefined;

            if (item.type === "Oven") {
                return (item as Oven).id;
            } else if (item.type === "Kitchen") {
                return (item as Kitchen).id;
            }
        }).join(", ");

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": (attr: Attributes) => {
        attr["launch"] = 1;
        return Frames["Start"];
    }
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Store", entry, unhandled, actionMap);