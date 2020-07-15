import * as bcrypt from "bcrypt"

export class Auth {
    private static rounds = 12;

    static async isValid(passwd: string, hash: string) {
        const isValid = await bcrypt.compare(passwd, hash);
        return isValid;
    }

    static async hash(passwd: string) {
        const salt = await bcrypt.genSalt(Auth.rounds);
        const hash = await bcrypt.hash(passwd, salt);
        return hash;
    }
}