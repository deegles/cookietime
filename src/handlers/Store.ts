import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";
import {ItemType, Kitchen, Oven} from "../resources/inventory";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    model.speech = "You can purchase: " + attr.Upgrades.map(u => {
            if (u.type === "Oven") {
                return (u as Oven).id;
            } else if (u.type === "Kitchen") {
                return (u as Kitchen).id;
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