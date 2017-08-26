import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Attributes, RequestContext} from "../definitions/SkillContext";

import * as Frames from "../definitions/FrameDirectory";

let entry = (attr: Attributes, ctx: RequestContext) => {

    let model = new ResponseModel();

    model.speech = "hello";
    model.reprompt = "hello again";

    attr["myprop"] = "1";

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": (attr: Attributes) => {
        attr["launch"] = 1;
        return Frames["Start"];
    },
    "AMAZON.NoIntent": (attr: Attributes) => {
        attr["no"] = 1;
        return Frames["InProgress"];
    }
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Start", entry, unhandled, actionMap);