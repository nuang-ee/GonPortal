import * as nodemailer from "nodemailer";
import * as crypto from "crypto";
import b64u from "base64url";
import { MAIL_MAC } from "../config";

if (!process.env.NODEMAILER_USERNAME || !process.env.NODEMAILER_PASSWORD) {
    console.log('env not set: nodemailer');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

const { secret, validDuration, ivLength, authTagLength } = MAIL_MAC;
const key = crypto.createHash('sha256').update(secret).digest();

export type AuthData = {
    uid: string,
    email: string,
    validUntil: Number,
};

export async function sendAuthMail(uid: string, email: string): Promise<any> {
    const authData = {
        uid: uid,
        email: email,
        validUntil: Date.now() + validDuration,
    } as AuthData;

    const iv = crypto.randomBytes(ivLength);
    const authCipher = crypto.createCipheriv('aes-256-gcm', key, iv, {authTagLength: authTagLength});
    const authCode = Buffer.concat([authCipher.update(JSON.stringify(authData)), authCipher.final()]); 
    const authTag = authCipher.getAuthTag();

    // TODO: compose link from config or env
    const verifyLink = `http://localhost/users/mailAuth/${b64u.encode(iv)}/${b64u.encode(authCode)}/${b64u.encode(authTag)}`;
    return transporter.sendMail({
        from: `"KAIST GoN" <noreply@goatskin.kr>`,
        to: email,
        subject: 'GoN Newbie Recruiting Page Authentication',
        text: `Verification Link: ${verifyLink}`,
        html: `<p>Verification Link: <a href="${verifyLink}">${verifyLink}</a></p>`,
    });
}

export function verifyAuthMail(iv: string, authCode: string, authTag: string): AuthData | undefined {
    try {
        const authDecipher = crypto.createDecipheriv('aes-256-gcm', key, b64u.toBuffer(iv), {authTagLength: authTagLength});
        authDecipher.setAuthTag(b64u.toBuffer(authTag));
        const dataDecrypted = Buffer.concat([authDecipher.update(b64u.toBuffer(authCode)), authDecipher.final()]);
        const authData = JSON.parse(dataDecrypted.toString()) as AuthData; 

        if (authData.validUntil < Date.now()) {
            return undefined;
        }
        return authData;
    } catch (_) {
        return undefined;
    }
}
