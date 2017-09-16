
/***
 * @example
 * {
    "query": "purchase easy bake oven home oven",
    "topScoringIntent": {
        "intent": "PurchaseUpgradeIntent",
        "score": 0.999910355
    },
    "entities": [
        {
            "entity": "easy bake oven",
            "type": "OVENS",
            "startIndex": 9,
            "endIndex": 22,
            "resolution": {
                "values": [
                    "EasyBake"
                ]
            }
        },
        {
            "entity": "home oven",
            "type": "OVENS",
            "startIndex": 24,
            "endIndex": 32,
            "resolution": {
                "values": [
                    "HomeOven"
                ]
            }
        }
    ]
}

 {
    "query": "eat a cookie",
    "topScoringIntent": {
        "intent": "EatCookieIntent",
        "score": 0.954808831
    },
    "entities": []
}

 {
    "query": "eat a cookie",
    "topScoringIntent": {
        "intent": "EatCookieIntent",
        "score": 0.954808831
    },
    "intents": [
        {
            "intent": "EatCookieIntent",
            "score": 0.954808831
        },
        {
            "intent": "None",
            "score": 0.0109223677
        },
        {
            "intent": "CheckUpgradesIntent",
            "score": 0.00174290349
        },
        {
            "intent": "CookieIntent",
            "score": 0.000005270737
        },
        {
            "intent": "PurchaseUpgradeIntent",
            "score": 8.15255348e-8
        }
    ],
    "entities": []
}
 */

export interface LUISServiceResponse {
    query: string;
    topScoringIntent: IntentResult;
    intents: Array<IntentResult>;
    entities: Array<LUISEntity>;
}

export interface IntentResult {
    intent: string;
    score: number;
}

export interface LUISEntity  {
    entity: string;
    type: string;
    startIndex: number;
    endIndex: number;
    resolution: {
        values: Array<string>;
    };
}
