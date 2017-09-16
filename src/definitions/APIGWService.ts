/***
 * TODO: definitions
 @example
 {
    "resource": "/cortana",
    "path": "/cookie/cortana",
    "httpMethod": "POST",
    "headers": {
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IllBSms3T2dQR210X3FPdTdESGpfRTljVGI3cyIsIng1dCI6IllBSms3T2dQR210X3FPdTdESGpfRTljVGI3cyJ9.eyJzZXJ2aWNldXJsIjoiaHR0cHM6Ly9Db3J0YW5hQkZDaGFubmVsRWFzdFVzLmF6dXJld2Vic2l0ZXMubmV0LyIsImlzcyI6Imh0dHBzOi8vYXBpLmJvdGZyYW1ld29yay5jb20iLCJhdWQiOiJhYTU2NzczZC02NjcwLTQzYTEtOTk3Yi1mNzQ0MDFlNmJmN2UiLCJleHAiOjE1MDU1MjY3NjQsIm5iZiI6MTUwNTUyNjE2NH0.R3yHdyq2R6y43esl1xDeUEN6PYQwy36d52kN5JIWOM0yVMKFw1CYTwbpKaPsccDKaQTcEW_nSZ0gv4T9CIV91GAtZ5vlpyz8Ip7ZDHfsuGFlwhWBJdIvGJDD2055NpecJPsGlRL8BM9eDOAmevPc_JJRQXthsmUcK1byLnu6G_XLaKCNhg9NfzsH8UJMYdYgujmCtUPtVEqaBsu6ccsFPd94hBsXh8EyUkd6Oum6FuYp-omCrPtsZ-9_ygT2SOY0en2R-U9A7mopacWMt7fVvDfqVSJ8yOsA4LFegF2LvaWtIwIZB-tt_XkqR5bptABDdPBn-GgpbdN96uWZ5TEDiQ",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "Content-Type": "application/json; charset=utf-8",
        "Host": "api.vokkal.co",
        "User-Agent": "Microsoft-CortanaChannel/3.0 (Microsoft-BotFramework/3.1 +https://botframework.com/ua)",
        "Via": "1.1 dc698cd00b7ec82887573cfaba9ecca6.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "_KKF1a6tpUXsvfYKqki6faeiI22oNfjykSFYvrp-G5Ov1Tp0hSKE8A==",
        "X-Amzn-Trace-Id": "Root=1-59bc8193-1abc0a4d2d85e6ab4e8905b8",
        "X-Correlating-OperationId": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcGVyYXRpb25JRCI6Il9DbklCRWRjMW5iSyIsImlzcyI6Imh0dHA6Ly9ib3RmcmFtZXdvcmsuY29tIiwiZXhwIjoxNTA1NTI5NzY0LCJuYmYiOjE1MDU1MjYxNjR9.iVXv9HjYMxuH1oxK4FX-aaQuN-3irskJUe4vkgSDPsk",
        "X-Forwarded-For": "40.117.188.101, 54.240.144.3",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "queryStringParameters": null,
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "path": "/cookie/cortana",
        "accountId": "594681367028",
        "resourceId": "5bvv25",
        "stage": "PROD",
        "requestId": "556ae6db-9a80-11e7-8ba0-25cbfaa2b4a1",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "apiKey": "",
            "sourceIp": "40.117.188.101",
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Microsoft-CortanaChannel/3.0 (Microsoft-BotFramework/3.1 +https://botframework.com/ua)",
            "user": null
        },
        "resourcePath": "/cortana",
        "httpMethod": "POST",
        "apiId": "atyoktlddb"
    },
    "body": "{\"type\":\"message\",\"id\":\"CPChMObSftu\",\"timestamp\":\"2017-09-16T01:42:43.8796377Z\",\"serviceUrl\":\"https://CortanaBFChannelEastUs.azurewebsites.net/\",\"channelId\":\"cortana\",\"from\":{\"id\":\"286BF677DE5948378920083C43E8D3D3EE807B14BA3EB517DACD36EBE540BB94\"},\"conversation\":{\"id\":\"22586db8-a8fe-4d5e-96e1-306da615a9c7\"},\"recipient\":{\"id\":\"cookietimebot\"},\"locale\":\"en-US\",\"entities\":[{\"type\":\"Intent\",\"name\":\"Microsoft.Launch\"},{\"type\":\"DeviceInfo\",\"supportsDisplay\":\"true\"}],\"channelData\":{\"skillId\":\"f45ebaba-4b87-4130-9d5e-0f54b4207cce\",\"skillProductId\":\"978315b5-65ef-4e4b-9f52-885d4f2a187d\",\"isDebug\":false}}",
    "isBase64Encoded": false
}
 */