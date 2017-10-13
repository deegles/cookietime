"use strict";
let path = require("path");
let aws = require("aws-sdk");

let credentials = new aws.SharedIniFileCredentials({profile: "cookietime"});
aws.config.credentials = credentials;

let lambda = new aws.Lambda({apiVersion: "2015-03-31", region: "us-east-1"});
let lambdaARN_Dev = "arn:aws:lambda:us-east-1:594681367028:function:cookieTime";
let zipPath = path.join(__dirname, "../build/skill_bundle.js.zip");

let startTime = new Date().getTime();
let fs = require("fs");

let dance = undefined;

function updateFunctionCode() {
    let params = {
        FunctionName: lambdaARN_Dev,
        Publish: false,
        ZipFile: fs.readFileSync(zipPath)
    };

    dance = setInterval(function () {
        process.stdout.write(dances[Math.floor(Math.random() * dances.length)] + " ");
    }, 500);

    lambda.updateFunctionCode(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            updateFunctionConfig();
        }
    });
}

// http://docs.aws.amazon.com/lambda/latest/dg/API_UpdateFunctionConfiguration.html
function updateFunctionConfig() {
    let params = {
        FunctionName: lambdaARN_Dev,
        Handler: "index.default",
        MemorySize: 512,
        Timeout: 15
    };
    lambda.updateFunctionConfiguration(params, function (err, data) {
        clearInterval(dance);
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log("Success!\nUpload time: " + ((new Date().getTime() - startTime) / 1000).toFixed(2) + "s");
            fs.unlinkSync(zipPath);
        }
    });

}

let dances = ["♬", "ヘ(￣ω￣ヘ)", "(ノ￣ー￣)ノ", "ヘ(￣ー￣ヘ)", "(ノ^_^)ノ", "(ノ￣ω￣)ノ", "＼(ﾟｰﾟ＼)", "ヾ(･ω･)ﾉ",
    "└( ＾ω＾ )」", "(~‾▿‾)~", "〜(￣△￣〜)", "~(‾▿‾)~"];

process.stdout.write("Starting upload to " + lambdaARN_Dev + "... ");
updateFunctionCode();