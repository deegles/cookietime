"use strict";

export const handlers = {
    "NewSession": function () {
        // Redirect to START
        this.handler.state = "START";
        this.emitWithState("NewSession");
    }
};