namespace Skill {
    export class Context {
        constructor() {

        }

        get = (key: string): string | number => {
            return "a val";
        }

        set = (key: string, val: string | number): boolean => {
            return true;
        }
    }
}

export = Skill;
