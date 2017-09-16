import * as request from "request";

export interface Token {
    token_type: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
}

interface CachedToken extends Token {
    expires_on: number;
}

let cachedToken: CachedToken;

export function getBotframeworkToken(): Promise<Token> {
    return new Promise((resolve, reject) => {
        try {
            if (tokenIsExpired()) {
                request.post({
                    url: "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token",
                    form: {
                        grant_type: "client_credentials",
                        client_id: process.env["MicrosoftAppId"],
                        client_secret: process.env["MicrosoftAppSecret"],
                        scope: "https://api.botframework.com/.default"
                    }
                }, function (err, response, body) {
                    if (response.statusCode === 200) {
                        let token = JSON.parse(body) as Token;
                        let now = new Date();
                        token["expires_on"] = now.getTime() + token.expires_in * 1000;
                        cachedToken = token as CachedToken;
                        resolve(cachedToken);
                    } else {
                        reject(err);
                    }
                });
            } else {
                resolve(cachedToken);
            }
        } catch (error) {
            console.log("error fetching token: " + error);
            reject(error);
        }
    });
}

function tokenIsExpired(): boolean {
    let now = new Date();

    return !cachedToken || now.getTime() > (cachedToken.expires_on - 5 * 1000);
}


export function validateToken() {
    // TODO: validate token from bot service
    // https://docs.microsoft.com/en-us/bot-framework/rest-api/bot-framework-rest-connector-authentication
}