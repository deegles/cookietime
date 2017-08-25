import {AlexaResponseBody} from "../definitions/AlexaService";
import {ResponseModel} from "../definitions/Handler";
import {View} from "../definitions/Views";

new View("AlexaStandard", (model: ResponseModel) => {

    let response: AlexaResponseBody = {
        version: "1.0",
        response: {
            shouldEndSession: false,
            outputSpeech: {
                type: "PlainText",
                text: model.speech
            },
            reprompt: {
                outputSpeech: {
                    type: "PlainText",
                    text: model.reprompt
                }
            }
        }
    };

    return response;
});