import {Frame} from "./Handler";

export class FrameDirectory {
    constructor() {

    }

    get(prop): Frame | undefined {
        console.log(`Fetching frame ${prop}, ${prop in this ? "found" : "not found"}.`);
        return this[prop];
    }

    set(prop, value): boolean {
        console.log(`adding frame ${prop}...`);

        if (prop in this) {
            throw new Error(`Error, frame ${prop} already exists. All frame IDs must be unique.`);
        }

        return this[prop] = value;
    }
}

// from https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
// create a unique, global symbol name
// -----------------------------------

const FRAME_DIRECTORY_KEY = Symbol.for("CookieTime.namespace.FrameDirectory");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

let globalSymbols = Object.getOwnPropertySymbols(global);
let hasFrameDir = (globalSymbols.indexOf(FRAME_DIRECTORY_KEY) > -1);

if (!hasFrameDir) {
    console.log("Initializing Frame directory...");
    global[FRAME_DIRECTORY_KEY] = new FrameDirectory();
}

// define the singleton API
// ------------------------

let singleton = {};

Object.defineProperty(singleton, "instance", {
    get: function () {
        return global[FRAME_DIRECTORY_KEY];
    }
});

// ensure the API is never changed
// -------------------------------

Object.freeze(singleton);

// export the singleton API only
// -----------------------------

module.exports = singleton;