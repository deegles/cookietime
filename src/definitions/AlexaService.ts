import {ResponseBody} from "./Common";

/**
 * Alexa Skills Kit TypeScript definitions built from
 * [Alexa Skills Kit Interface Reference](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference).
 *
 * Date: 2016/04/01
 */
export interface RequestBody {
}

export type AlexaRequestType = "LaunchRequest" | "IntentRequest" | "SessionEndedRequest";

export const RequestType = {
    LaunchRequest: "LaunchRequest" as AlexaRequestType,
    IntentRequest: "IntentRequest" as AlexaRequestType,
    SessionEndedRequest: "SessionEndedRequest" as AlexaRequestType
};

/** String literal with possible values. Used in place of an enum to allow string type.
 * USER_INITIATED: The user explicitly ended the session.
 * ERROR: An error occurred that caused the session to end.
 * EXCEEDED_MAX_REPROMPTS: The user either did not respond or responded with an utterance that did not match any of the intents defined in your voice interface.
 */
export type SessionEndedReason = "USER_INITIATED" | "ERROR" | "EXCEEDED_MAX_REPROMPTS";
export const SessionEndedReason = {
    USER_INITIATED: "USER_INITIATED" as SessionEndedReason,
    ERROR: "ERROR" as SessionEndedReason,
    EXCEEDED_MAX_REPROMPTS: "EXCEEDED_MAX_REPROMPTS" as SessionEndedReason
};

/** String literal with possible values. Used in place of an enum to allow string type. */
export type OutputSpeechType = "PlainText" | "SSML";
export const OutputSpeechType = {
    PlainText: "PlainText" as OutputSpeechType,
    SSML: "SSML" as OutputSpeechType,
};

/** String literal with possible values. Used in place of an enum to allow string type. */
export type CardType = "Simple" | "Standard" | "LinkAccount";
export const CardType = {
    Simple: "Simple" as CardType,
    Standard: "Standard" as CardType,
    LinkAccount: "LinkAccount" as CardType
};
/**
 * The request body sent to your service is in JSON format.
 * @example
 {
        "version": "string",
        "session": {
            "new": boolean,
            "sessionId": "string",
            "application": {
                "applicationId": "string"
            },
            "attributes": {
                "string": object
            },
            "user": {
                "userId": "string",
                "permissions": {
                        "consentToken": "string"
                 },
                "accessToken": "string"
            }
        },
        "context": {
            "System": {
                "application": {
                    "applicationId": "string"
                },
                "user": {
                    "userId": "string",
                    "permissions": {
                        "consentToken": "string"
                    },
                    "accessToken": "string"
                },
                "device": {
                    "deviceId": "string",
                    "supportedInterfaces": {
                        "AudioPlayer": {}
                    }
                }
            },
            "AudioPlayer": {
                "token": "string",
                "offsetInMilliseconds": 0,
                "playerActivity": "string"
            }
        }
        "request": object
    }
 */
export interface AlexaRequestBody extends RequestBody {
    /** The version specifier for the request with the value defined as: “1.0” */
    version: string;
    /** The session object provides session specific information associated with the request. */
    session: Session;
    /** The context object provides data about the context of a request **/
    context: Context;
    /** An object that is composed of associated parameters that further describes the user’s request. */
    request: Request;
}

/**
 * Session Object
 */
export interface Session {
    /** A boolean value indicating whether this is a new session. Returns true for a new session or false for an existing session. */
    "new": boolean;
    /** A string that represents a unique identifier per a user’s active session. Note: A sessionId is consistent for multiple subsequent requests for a user and session. If the session ends for a user, then a new unique sessionId value is provided for subsequent requests for the same user. */
    sessionId: string;
    /** A map of key-value pairs. The attributes map is empty for requests where a new session has started with the attribute new set to true.
     * The key is a string that represents the name of the attribute. Type: string
     * The value is an object that represents the value of the attribute. Type: object
     */
    attributes: any;
    /** An object containing an application ID. This is used to verify that the request was intended for your service. */
    application: {
        applicationId: string;
    };
    /**
     * An object that describes the user making the request.
     * @see User
     */
    user: User;
}

/**
 * Context Object
 */
export interface Context {
    System: {
        application: {
            applicationId: string
        },
        user: {
            userId: string,
            permissions: {
                consentToken: string
            },
            accessToken: string
        },
        device: {
            deviceId: string,
            supportedInterfaces: {
                AudioPlayer: any
            }
        }
    };
    AudioPlayer: {
        token: string,
        offsetInMilliseconds: number,
        playerActivity: string
    };
}

/** User object used in Session */
export interface User {
    /** A string that represents a unique identifier for the user who made the request. The length of this identifier can vary, but is never more than 255 characters. The userId is automatically generated when a user enables the skill in the Alexa app. Note that disabling and re-enabling a skill generates a new identifier. */
    userId: string;
    /** A token identifying the user in another system. This is only provided if the user has successfully linked their account. See [Linking an Alexa User with a User in Your System](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/linking-an-alexa-user-with-a-user-in-your-system) for more details. */
    accessToken?: string;
    /** Contains a consentToken allowing the skill access to information that the customer has consented to provide **/
    permissions?: {
        consentToken: string
    };
}

/**
 * Request made to an Alexa skill. This is an "abstract base class" interface.
 *
 * Called "Request" instead of just Request to show that this is not the "request" object per se, but specific to the Alexa domain.
 */
export interface Request {
    /**
     * Type of concrete request.
     * @see AlexaRequestType
     * */
    type: AlexaRequestType;
    /** Represents the unique identifier for the specific request. */
    requestId: string;
    /** Provides the date and time when Alexa sent the request. Use this to verify that the request is current and not part of a “replay” attack. Timestamp is provided as an ISO 8601 formatted string (for example, 2015-05-13T12:34:56Z). */
    timestamp: string;
    /** A string indicating the user’s locale. For example: en-US. */
    locale: string;
}


/** Represents that a user made a request to an Alexa skill, but did not provide a specific intent. */
export interface LaunchRequest extends Request {
    // Adds nothing
}

/** Request made to a skill based on what the user wants to do. */
export interface IntentRequest extends Request {
    /**
     * An object that represents what the user wants.
     * @see Intent
     * */
    intent: Intent;
}

/** Represents an intent from a user. */
export interface Intent {
    /** A string representing the name of the intent. */
    name: string;
    /** A map of key-value pairs that further describes what the user meant based on a predefined intent schema. The map can be empty.
     * The key is a string that describes the name of the slot. Type: string.
     * The value is an object of type slot. Type: object.
     * @see Slot */
    slots: Slot[];
}

/**
 * Part of intent.
 * @see Intent.
 */
export interface Slot {
    /** A string that represents the name of the slot. */
    name: string;
    /** A string that represents the value of the slot. The value is not required.
     * Note that AMAZON.LITERAL slot values sent to your service are always in all lower case. */
    value?: string;
}

/** A SessionEndedRequest is an object that represents a request made to an Alexa skill to notify that a session was ended. */
export interface SessionEndedRequest extends Request {
    /**
     * Describes why the session ended. Possible values:
     *   USER_INITIATED: The user explicitly ended the session.
     *   ERROR: An error occurred that caused the session to end.
     *   EXCEEDED_MAX_REPROMPTS: The user either did not respond or responded with an utterance that did not match any of the intents defined in your voice interface.
     * @see SessionEndedReason
     */
    reason: SessionEndedReason;
    error: {
        type: string;
        message: string;
    };
}

/**
 * Response Body Object
 * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#Response Format
 * @example {
                "version": "string",
                "sessionAttributes": {
                    "string": object
                },
                "response": {
                    "outputSpeech": {
                        "type": "string",
                        "text": "string",
                        "ssml": "string"
                    },
                    "card": {
                        "type": "string",
                        "title": "string",
                        "content": "string",
                        "text": "string",
                        "image": {
                            "smallImageUrl": "string",
                            "largeImageUrl": "string"
                        }
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "string",
                            "text": "string",
                            "ssml": "string"
                        }
                    },
                    "shouldEndSession": boolean
                }
            }
 */

export interface AlexaResponseBody extends ResponseBody {
    /** The version specifier for the response with the value to be defined as: “1.0” */
    version: string;
    /** A map of key-value pairs to persist in the session.
     * The key is a string that represents the name of the attribute. Type: string.
     * The value is an object that represents the value of the attribute. Type: object. */
    sessionAttributes?: object;
    /**
     * A response object that defines what to render to the user and whether to end the current session.
     * @see Response
     */
    response: Response;
}

/** https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#response-object */
export interface Response {
    /**
     * The object containing the speech to render to the user.
     * @see OutputSpeech
     */
    outputSpeech?: OutputSpeech;
    /**
     * The object containing a card to render to the Amazon Alexa App.
     * @see Card
     */
    card?: Card;
    /**
     * The object containing the outputSpeech to use if a re-prompt is necessary.
     *
     * This is used if the your service keeps the session open after sending the response, but the user does not respond with anything that maps to an intent defined in your voice interface while the audio stream is open.
     *
     * If this is not set, the user is not re-prompted.
     * @see Reprompt
     */
    reprompt?: Reprompt;
    /** A boolean value with true meaning that the session should end, or false if the session should remain active. */
    shouldEndSession: boolean;
}

/**
 * This object is used for setting both the outputSpeech and the reprompt properties.
 * */
export interface OutputSpeech {
    /**
     * A string containing the type of output speech to render. Valid types are:
     *   "PlainText": Indicates that the output speech is defined as plain text.
     *   "SSML": Indicatesthat the output speech is text marked up with SSML.
     */
    type: OutputSpeechType;
    /** A string containing the speech to render to the user. Use this when type is "PlainText" */
    text?: string;
    /** A string containing text marked up with SSML to render to the user. Use this when type is "SSML" */
    ssml?: string;
}

/** Object describing a card presented to the user in the Alexa app. */
export interface Card {
    /**A string describing the type of card to render. Valid types are:
     * "Simple": A card that contains a title and plain text content.
     * "Standard": A card that contains a title, text content, and an image to display.
     * "LinkAccount": a card that displays a link to an authorization URL that the user can use to link their Alexa account with a user in another system. See Linking an Alexa User with a User in Your System for details. */
    type: CardType;
    /**A string containing the title of the card. (not applicable for cards of type LinkAccount). */
    title?: string;
    /**A string containing the contents of a Simple card (not applicable for cards of type Standard or LinkAccount).
     * Note that you can include line breaks in the content for a card of type Simple. Use either “\r\n” or “\n” within the text of the card to insert line breaks. */
    content?: string;
    /**A string containing the text content for a Standard card (not applicable for cards of type Simple or LinkAccount)
     * Note that you can include line breaks in the text for a Standard card. Use either “\r\n” or “\n” within the text of the card to insert line breaks. */
    text?: string;
    /**
     * An image object that specifies the URLs for the image to display on a Standard card. Only applicable for Standard cards.
     * @see Image
     */
    image?: Image;
}

/**
 * Allows to specify small and large urls for images in cards.
 * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/providing-home-cards-for-the-amazon-alexa-app
 */
export interface Image {
    /** Url for small image. */
    smallImageUrl?: string;
    /** Url for large image. */
    largeImageUrl?: string;
}

/**
 * A prompt that asks the user a question after a dialogue error has occurred. The general purpose of a re-prompt is to help the user recover from errors. Example:

 User: “Alexa, open Score Keeper”
 Alexa: Score Keeper. What’s your update?
 User: (no response)
 Alexa: “You can add points for a player, ask for the current score, or start a new game. To hear a list of everything you can do, say Help. Now, what would you like to do?”
 * A re-prompt is usually played to encourage the user to respond.
 */
export interface Reprompt {
    /** An OutputSpeech object containing the text or SSML to render as a re-prompt. */
    outputSpeech?: OutputSpeech;
}