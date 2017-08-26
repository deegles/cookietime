import {View} from "./Views";
class ViewsDirectory {
    constructor() {

    }

    get(prop): View | undefined {
        console.log(`Fetching view ${prop}...`);

        if (!(prop in this)) {
            throw new Error(`Error, view ${prop} not found.`);
        }

        return this[prop];
    }

    set(prop, value): boolean {
        console.log(`adding view ${prop}...`);

        if (prop in this) {
            throw new Error(`Error, view ${prop} already exists. All view IDs must be unique.`);
        }

        return this[prop] = value;
    }
}

// from https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
// create a unique, global symbol name
// -----------------------------------

const VIEWS_DIRECTORY_KEY = Symbol.for("CookieTime.namespace.ViewsDirectory");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

let globalSymbols = Object.getOwnPropertySymbols(global);
let hasViewsDir = (globalSymbols.indexOf(VIEWS_DIRECTORY_KEY) > -1);

if (!hasViewsDir) {
    console.log("Initializing views directory...");
    global[VIEWS_DIRECTORY_KEY] = new ViewsDirectory();
}

// define the singleton API
// ------------------------

let singleton = {};

Object.defineProperty(singleton, "instance", {
    get: function () {
        return global[VIEWS_DIRECTORY_KEY];
    }
});

// ensure the API is never changed
// -------------------------------

// Object.freeze(singleton);

// export the singleton API only
// -----------------------------

module.exports = singleton;
