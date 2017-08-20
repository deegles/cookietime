export const handlers = {
    "NewSession": async function () {
        WelcomeHandler.apply(this).catch(err => {
            this.handler.error(err.stack);
            this.context.fail("error in Start => NewSession");
        });
    },
    "Unhandled": function () {
        let message = "I didn’t quite catch that. Could you say it again?";
        let reprompt = "Could you say that again?";

        this.response.speak(message).listen(reprompt);
        this.emit(":responseReady");
    }
};

async function WelcomeHandler() {
    let message = this.t("START_WELCOME");
    let reprompt = this.t("START_WELCOME");

    this.response.speak(message).listen(reprompt);
    this.emit(":responseReady");
}