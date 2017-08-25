import {Frame, ResponseContext, ResponseModel} from "../definitions/Handler";
import {Context} from "../definitions/SkillContext";
import "./Start";


let Frames = require("../definitions/FrameDirectory");

let entry = (ctx: Context) => {

    let model = new ResponseModel();

    model.speech = "hello";
    model.reprompt = "hello again";

    return new ResponseContext(model);
};

let actionMap = {
    "LaunchRequest": () => {
        return Frames["Start"];
    }
};

let unhandled = () => {
    return Frames["Start"];
};

new Frame("Start", entry, unhandled, actionMap);