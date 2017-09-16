/***
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

export type BotFrameworkRequestType = "message";

export const BotFrameworkRequestType = {
    message: "message" as BotFrameworkRequestType
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

export interface BotFrameWorkRequestBody extends RequestBody {
    type: BotFrameworkRequestType;
    id: string;
    timestamp: string;
    serviceUrl: string;
    channelId: BotFrameworkChannelType;
    from: {
        id: string;
    };
    conversation: {
        id: string;
    };
    recipient: {
        id: string;
    };
    locale: BotFrameworkLocale;
    text: string;
    entities: Array<Entity>;
    channelData: ChannelData;

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