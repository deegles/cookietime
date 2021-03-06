"use strict";
import * as aws from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk-core";

import {DocumentClient} from "aws-sdk/clients/dynamodb";
import * as LZUTF8 from "lzutf8";

AWSXRay["captureAWS"](aws);

let _doc: DocumentClient;

let newTableParams = {
    TableName: "",
    AttributeDefinitions: [
        {
            AttributeName: "userId",
            AttributeType: "B"
        }
    ],
    KeySchema: [
        {
            AttributeName: "userId",
            KeyType: "HASH"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

export class DAL {
    constructor(table: string) {
        this.table = table;

        if (!_doc) {
            _doc = new aws.DynamoDB.DocumentClient({apiVersion: "2012-08-10"});
        }

        this.doc = _doc;
    }

    doc: DocumentClient;

    table: string;

    get = (userId) => {
        return new Promise((resolve, reject) => {
            if (!this.table) {
                reject("DynamoDB Table name is not set.");
            }

            let params = {
                Key: {
                    userId: LZUTF8["compress"](userId)
                },
                TableName: this.table,
                ConsistentRead: true
            };

            this.doc.get(params, (err, data) => {
                if (err) {
                    console.log("get error: " + JSON.stringify(err, undefined, 4));

                    if (err.code === "ResourceNotFoundException") {
                        let dynamoClient = new aws.DynamoDB();
                        newTableParams.TableName = this.table;
                        dynamoClient.createTable(newTableParams, (err, data) => {
                            if (err) {
                                console.log("Error creating table: " + JSON.stringify(err, undefined, 4));
                                return reject(err);
                            }

                            console.log("Creating table " + this.table + ":\n" + JSON.stringify(data));

                            let params = {
                                TableName: this.table
                            };

                            dynamoClient.waitFor("tableExists", params, (err, data) => {
                                resolve({});
                            });

                        });
                    } else {
                        reject(err);
                    }
                } else {
                    if (isEmptyObject(data)) {
                        resolve({});
                    } else {
                        let obj = {};

                        if (data && data.Item && data.Item["cData"] && data.Item["cData"]["data"]) {
                            obj = JSON.parse(LZUTF8["decompress"](data.Item["cData"]["data"]));
                        } else if (data && data.Item && data.Item["mapAttr"]) {
                            obj = data.Item["mapAttr"];
                        }

                        resolve(obj);
                    }
                }
            });
        });
    }

    set = (userId, data) => {
        return new Promise((resolve, reject) => {
            try {
                if (!this.table) {
                    return reject(new Error("DynamoDB Table name is not set."));
                }

                let compressed = LZUTF8["compress"](JSON.stringify(data));
                let params = {
                    Item: {
                        userId: LZUTF8["compress"](userId),
                        cData: {data: compressed}
                    },
                    TableName: this.table
                };

                this.doc.put(params, (err, data) => {
                    if (err) {
                        return reject(new Error("Error during DynamoDB put:" + err));
                    }
                    resolve(data);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}