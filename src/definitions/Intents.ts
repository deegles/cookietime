export type AlexaIntents =
    "AMAZON.CancelIntent"
    | "AMAZON.HelpIntent"
    | "AMAZON.MoreIntent"
    | "AMAZON.NavigateHomeIntent"
    | "AMAZON.NavigateSettingsIntent"
    | "AMAZON.NextIntent"
    | "AMAZON.NoIntent"
    | "AMAZON.PageDownIntent"
    | "AMAZON.PageUpIntent"
    | "AMAZON.PauseIntent"
    | "AMAZON.PreviousIntent"
    | "AMAZON.RepeatIntent"
    | "AMAZON.ScrollDownIntent"
    | "AMAZON.ScrollLeftIntent"
    | "AMAZON.ScrollRightIntent"
    | "AMAZON.ScrollUpIntent"
    | "AMAZON.StartOverIntent"
    | "AMAZON.StopIntent"
    | "AMAZON.YesIntent"
    | "CheckUpgradesIntent"
    | "CookieIntent"
    | "EatCookieIntent"
    | "LaunchRequest"
    | "SessionEndedRequest"
    | "PurchaseUpgradeIntent";

export type CortanaIntents =
    "Microsoft.Launch"
    | "Utilities.Confirm"
    | "Utilities.Cancel"
    | "Places.StartOver"
    | "None";

export type SkillIntents =
    "CancelIntent"
    | "HelpIntent"
    | "MoreIntent"
    | "NavigateHomeIntent"
    | "NavigateSettingsIntent"
    | "NextIntent"
    | "NoIntent"
    | "PageDownIntent"
    | "PageUpIntent"
    | "PauseIntent"
    | "PreviousIntent"
    | "RepeatIntent"
    | "ScrollDownIntent"
    | "ScrollLeftIntent"
    | "ScrollRightIntent"
    | "ScrollUpIntent"
    | "StartOverIntent"
    | "StopIntent"
    | "YesIntent"
    | "CheckUpgradesIntent"
    | "CookieIntent"
    | "EatCookieIntent"
    | "LaunchRequest"
    | "SessionEndedRequest"
    | "PurchaseUpgradeIntent"
    | "None";

export type AllIntentNames = AlexaIntents | CortanaIntents;

export const Intents: {[Key in AllIntentNames]: SkillIntents } = {
    "AMAZON.CancelIntent": "CancelIntent",
    "AMAZON.HelpIntent": "HelpIntent",
    "AMAZON.MoreIntent": "MoreIntent",
    "AMAZON.NavigateHomeIntent": "NavigateHomeIntent",
    "AMAZON.NavigateSettingsIntent": "NavigateSettingsIntent",
    "AMAZON.NextIntent": "NextIntent",
    "AMAZON.NoIntent": "NoIntent",
    "AMAZON.PageDownIntent": "PageDownIntent",
    "AMAZON.PageUpIntent": "PageUpIntent",
    "AMAZON.PauseIntent": "PauseIntent",
    "AMAZON.PreviousIntent": "PreviousIntent",
    "AMAZON.RepeatIntent": "RepeatIntent",
    "AMAZON.ScrollDownIntent": "ScrollDownIntent",
    "AMAZON.ScrollLeftIntent": "ScrollLeftIntent",
    "AMAZON.ScrollRightIntent": "ScrollRightIntent",
    "AMAZON.ScrollUpIntent": "ScrollUpIntent",
    "AMAZON.StartOverIntent": "StartOverIntent",
    "AMAZON.StopIntent": "StopIntent",
    "AMAZON.YesIntent": "YesIntent",
    "CheckUpgradesIntent": "CheckUpgradesIntent",
    "CookieIntent": "CookieIntent",
    "EatCookieIntent": "EatCookieIntent",
    "LaunchRequest": "LaunchRequest",
    "SessionEndedRequest": "SessionEndedRequest",
    "PurchaseUpgradeIntent": "PurchaseUpgradeIntent",
    "Microsoft.Launch": "LaunchRequest",
    "None": "None",
    "Utilities.Confirm": "YesIntent",
    "Utilities.Cancel": "CancelIntent",
    "Places.StartOver": "StartOverIntent"
};
