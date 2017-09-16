import * as request from "request";

let qnaSubKey = process.env["qnaSubKey"];

/**
 * Returns an answer to a question.
 */
export const ask = function (questionText: string, kb: string): Promise<string> {
    return new Promise(resolve => {
        try {
            request.post({
                headers: {
                    "content-type": "application/json",
                    "Ocp-Apim-Subscription-Key": qnaSubKey
                },
                url: `https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/${kb}/generateAnswer`,
                body: JSON.stringify({question: questionText})
            }, function (error, response, body) {
                console.log("Response: " + body);
                if (response.statusCode === 200) {
                    let answer = JSON.parse(body);
                    resolve(answer["answers"][0]);
                } else {
                    resolve("");
                }
            });
        } catch (e) {
            console.log("EXCEPTION " + e);
            resolve("");
        }
    });
};