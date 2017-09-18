import * as request from "request";
import {LUISServiceResponse} from "../definitions/LUISService";

let luisSubKey = process.env["luisSubKey"];
let luisAppId = process.env["luisAppId"];

let requestCache: { [key: string]: LUISServiceResponse } = {}; // TODO: extend with a dynamodb layer

/**
 * Performs NLU using LUIS.
 */
export const query = function (query: string): Promise<LUISServiceResponse> {
    return new Promise((resolve, reject) => {
        try {
            query = query.toLowerCase();
            if (query in requestCache) {
                console.log("Found cached value...");
                return resolve(requestCache[query]);
            }

            request.get({
                url: `https://eastus2.api.cognitive.microsoft.com/luis/v2.0/apps/${luisAppId}?subscription-key=${luisSubKey}&timezoneOffset=0&verbose=false&q=${query}`,
            }, function (error, response, body) {
                console.log("Response: " + body);
                if (response.statusCode === 200) {
                    let luisResponse = JSON.parse(body) as LUISServiceResponse;
                    requestCache[query] = luisResponse;
                    resolve(luisResponse);
                } else {
                    reject(error);
                }
            });
        } catch (e) {
            console.log("EXCEPTION " + e);
            console.log("Query: " + query);
            reject(e);
        }
    });
};