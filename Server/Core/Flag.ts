export class Flag {
    static isValidFormat(flag: string) {
        const flagRegex = /GoN\{.+\}/;
        return flagRegex.test(flag);
    }
}
