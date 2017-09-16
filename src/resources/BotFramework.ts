import * as request from "request";
import {BotFrameworkActivity} from "../definitions/BotFrameworkService";

/**
 * Returns an answer to a question.
 */
export const sendActivity = function (activity: BotFrameworkActivity, serviceURL: string, conversationId: string, activityId: string, token: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            request.post({
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                url: `${serviceURL}v3/conversations/${conversationId}/activities${activityId ? "/" + activityId : ""}`,
                body: JSON.stringify(activity)
            }, function (error, response, body) {
                if (response.statusCode === 200) {
                    let result = JSON.parse(body);
                    resolve(result);
                } else {
                    reject(error);
                }
            });
        } catch (e) {
            console.log("EXCEPTION " + e);
            reject(e);
        }
    });
};
