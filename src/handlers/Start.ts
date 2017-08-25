import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Context} from "../definitions/SkillContext";

let Frames = require("../definitions/FrameDirectory");

let entry = (ctx: Context) => {

    let model = new ResponseModel();

    model.speech = "hello";
    model.reprompt = "hello again";

    let r = new ResponseContext(model);

    return r;
};

let actionMap = {
    "LaunchRequest": function () {
        return Frames["Start"];
    }
};

let Start = new Frame("Start", entry, actionMap);

