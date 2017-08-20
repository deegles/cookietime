/**
 * States directory. Add any states here and they will be automatically included.
 * Needed for compatibility with webpack.
 */
import * as Alexa from "alexa-sdk";

export const states = [];

/**
 * Handles the user's first request after enablement
 */
let DEFAULT = require("./DEFAULT").handlers;
states.push(Alexa.CreateStateHandler("", DEFAULT));

/**
 * Entry point for skill.
 */
let START = require("./START").handlers;
states.push(Alexa.CreateStateHandler("START", START));