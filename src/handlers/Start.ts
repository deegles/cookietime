import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Context} from "../definitions/SkillContext";

let Frames = require("../definitions/FrameDirectory");

let entry = (ctx: Context) => {

    let r = new ResponseContext();

    let model = new ResponseModel();

    r.model = model;

    model.speech = "hello";
    model.reprompt = "hello again";

    return r;
};

let actionMap = {
    "LaunchRequest": function () {
        return Frames["Start"];
    }
};

let Start = new Frame("Start", entry, actionMap);

