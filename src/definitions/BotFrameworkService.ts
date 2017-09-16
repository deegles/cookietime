/***
 * https://docs.microsoft.com/en-us/bot-framework/rest-api/bot-framework-rest-connector-api-reference
 * @example
 {
  "type": "message",
  "id": "9C3j4hjg0eJ",
  "timestamp": "2017-09-15T15:41:46.136089Z",
  "serviceUrl": "https://CortanaBFChannelEastUs.azurewebsites.net/",
  "channelId": "cortana",
  "from": {
    "id": "286BF677DE5948378920083C43E8D3D3EE807B14BA3EB517DACD36EBE540BB94"
  },
  "conversation": {
    "id": "1b27b52e-571e-484f-8c74-be5af5de001b"
  },
  "recipient": {
    "id": "cookietimebot"
  },
  "locale": "en-US",
  "text": "and eat a cookie",
  "entities": [
    {
      "type": "Intent",
      "name": "None",
      "entities": []
    },
    {
      "type": "DeviceInfo",
      "supportsDisplay": "true"
    }
  ],
  "channelData": {
    "skillId": "f45ebaba-4b87-4130-9d5e-0f54b4207cce",
    "skillProductId": "978315b5-65ef-4e4b-9f52-885d4f2a187d",
    "isDebug": false
  }
}
 */

import {RequestBody} from "./Common";

export type BotFrameworkActivityType =
    "contactRelationUpdate"
    | "conversationUpdate"
    | "deleteUserData"
    | "message"
    | "ping"
    | "typing"
    | "endOfConversation";

export const BotFrameworkActivityType = {
    message: "message" as BotFrameworkActivityType
};

export type BotFrameworkChannelType = "cortana";

export const BotFrameworkChannelType = {
    cortana: "cortana" as BotFrameworkChannelType
};

export type BotFrameworkLocale = "en-us";

export const BotFrameworkLocale = {
    "en-us": "en-us" as BotFrameworkLocale
};

export type BotFrameworkEntity = "Intent" | "DeviceInfo";

export const BotFrameworkEntity = {
    "Intent": "Intent" as BotFrameworkEntity,
    "DeviceInfo": "DeviceInfo" as BotFrameworkEntity
};

export interface BotFrameworkActivity extends RequestBody {
    action: string;
    attachments: Array<string>; // TODO: attachment object
    attachmentLayout: string;
    channelData: ChannelData;
    channelId: BotFrameworkChannelType;
    conversation: ConversationAccount;
    entities: Array<Entity>;
    from: ChannelAccount;
    historyDisclosed: boolean;
    id: string;
    inputHint: string;
    locale: BotFrameworkLocale;
    localTimestamp: string;
    membersAdded: Array<ChannelAccount>;
    membersRemoved: Array<ChannelAccount>;
    recipient: ChannelAccount;
    relatesTo: string; // TODO: ConversationReference
    replyToId: string;
    serviceUrl: string;
    speak: string;
    suggestedActions: any; // TODO: SuggestedActions
    summary: string;
    text: string;
    textFormat: string;
    timestamp: string;
    topicName: string;
    type: BotFrameworkActivityType;
}

/**
 * Defines a bot or user account on the channel.
 */
export interface ChannelAccount {
    /**
     * ID that uniquely identifies the bot or user on the channel. */
    id: string;
    /**
     * Name of the bot or user. */
    name: string;
}

/**
 * Defines a conversation in a channel.
 */
export interface ConversationAccount {
    /**
     * The ID that identifies the conversation. The ID is unique per channel. If the channel starts
     * the conversion, it sets this ID; otherwise, the bot sets this property to the ID that it gets
     * back in the response when it starts the conversation. */
    id: string;
    /**
     * Flag to indicate whether or not this is a group conversation. Set to true if this is a group
     * conversation; otherwise, false. The default is false. */
    isGroup: boolean;
    /**
     * A display name that can be used to identify the conversation. */
    name: string;
}

export interface Entity {
    type: BotFrameworkEntity;
}

export interface Intent extends Entity {
    name: string;
    entities: Array<string>; // TODO: check this
}

export interface DeviceInfo extends Entity {
    supportsDisplay: boolean;
}

export interface ChannelData {
    skillId: string;
    skillProductId: string;
    isDebug: boolean;
}