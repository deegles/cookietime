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
    | "PurchaseUpgradeIntent"
    | "SessionEndedRequest";

export type CortanaIntents =
     "Microsoft.Launch"
    | "Microsoft.NoIntent"
    | "Microsoft.YesIntent"
    | "None"
    | "Places.StartOver"
    | "PurchaseUpgradeIntent"
    | "Utilities.Cancel"
    | "Utilities.Confirm"
    | "Utilities.GoBack"
    | "Utilities.Help"
    | "Utilities.Repeat"
    | "Utilities.ShowPrevious"
    | "Utilities.StartOver"
    | "Utilities.Stop";

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
    "Microsoft.Launch": "LaunchRequest",
    "Microsoft.NoIntent": "NoIntent",
    "Microsoft.YesIntent": "YesIntent",
    "None": "None",
    "Places.StartOver": "StartOverIntent",
    "PurchaseUpgradeIntent": "PurchaseUpgradeIntent",
    "SessionEndedRequest": "SessionEndedRequest",
    "Utilities.Cancel": "CancelIntent",
    "Utilities.Confirm": "YesIntent",
    "Utilities.GoBack": "PreviousIntent",
    "Utilities.Help": "HelpIntent",
    "Utilities.Repeat": "RepeatIntent",
    "Utilities.ShowPrevious": "PreviousIntent",
    "Utilities.StartOver": "StartOverIntent",
    "Utilities.Stop": "StopIntent",
};
