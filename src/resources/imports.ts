/**
 * Require all handlers and views here to work around typescript module elision.
 * TODO: find a better way to do this. :'(
 * https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-imports-being-elided-in-my-emit
 */

// Handlers
import "../handlers/Cookie";
import "../handlers/InProgress";
import "../handlers/Start";

// Views
import "../views/AlexaStandard";
