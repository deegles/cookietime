/**
 * Require all handlers and views here to work around typescript module elision.
 * TODO: find a better way to do this. :'(
 * https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-imports-being-elided-in-my-emit
 */

// If you're getting a "Cannot read property 'entry' of undefined" error you probably forgot to add the frame here
import "../handlers/Cookie";
import "../handlers/Repeat";
import "../handlers/Start";
import "../handlers/Store";
import "../views/AlexaStandard";