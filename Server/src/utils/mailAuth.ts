import * as nodemailer from "nodemailer";
import * as crypto from "crypto";
import b64u from "base64url";
import { MAIL_CONFIG } from "../config";

if (!MAIL_CONFIG.NODEMAILER_USERNAME || !MAIL_CONFIG.NODEMAILER_PASSWORD) {
    console.log('env not set: nodemailer');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: MAIL_CONFIG.NODEMAILER_USERNAME,
        pass: MAIL_CONFIG.NODEMAILER_PASSWORD,
    },
});

const { secret, validDuration, ivLength, authTagLength } = MAIL_CONFIG;
const key = crypto.createHash('sha256').update(secret).digest();

export type AuthData = {
    _id: string,
    email: string,
    validUntil: Number,
};

export function sendAuthMail(_id: string, email: string, callback: (err: Error | null, info: any) => void) {
    const authData = {
        _id: _id,
        email: email,
        validUntil: Date.now() + validDuration,
    } as AuthData;

    const iv = crypto.randomBytes(ivLength);
    const authCipher = crypto.createCipheriv('aes-256-gcm', key, iv, {authTagLength: authTagLength});
    const authCode = Buffer.concat([authCipher.update(JSON.stringify(authData)), authCipher.final()]); 
    const authTag = authCipher.getAuthTag();

    // TODO: compose link from config or env
    const verifyLink = `http://localhost/users/mailAuth/${b64u.encode(iv)}/${b64u.encode(authCode)}/${b64u.encode(authTag)}`;
    transporter.sendMail({
        from: `"KAIST GoN" <noreply@goatskin.kr>`,
        to: email,
        subject: 'GoN Newbie Recruiting Page Authentication',
        text: `Verification Link: ${verifyLink}`,
        html: `<p>Verification Link: <a href="${verifyLink}">${verifyLink}</a></p>`,
    }, callback);
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
