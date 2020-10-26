import * as jwt from "jsonwebtoken";
import { KEY } from "../config";
import { NewbieRefreshToken } from "../utils/db";
import { INewbieAccount } from "../Documents/Recruitment/AccountDocument";
import * as crypto from "crypto";
import { Request, Response } from "express";

const jwtSecret = KEY.JWT_SECRET;

interface IToken {
    id: string;
    role: string;
    emailAuthed: Boolean;

}

async function generateJwtToken(user: INewbieAccount) {
    return jwt.sign({ id: user.username, role: user.role, emailAuthed: user.emailAuthed },
                jwtSecret,
                { expiresIn: '15m' });
}

async function generateRefreshToken(user: INewbieAccount) {
    const refreshToken = await NewbieRefreshToken.create({
        user: user.username,
        token: crypto.randomBytes(40).toString("hex"),
        expires: new Date(Date.now() + 7*24*60*60*1000),
    })
    await refreshToken.save();
    return refreshToken;
}

export class NewbieAuth {
    static async generateToken(user: INewbieAccount) {
        const jwtToken = await generateJwtToken(user);
        const refreshToken = await generateRefreshToken(user);

        return { jwtToken, refreshToken };        
    }

    /* must be called before the handler of every authentication-needed
     * requests */
    static async authenticate(req: Request, res: Response, next: Function) {
        const token = req.headers['x-access-token'] as string;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'not logged in',
            })
        }

        try {
            const userInfo = jwt.verify(token, jwtSecret) as IToken;
            res.locals.tokenInfo = userInfo;
            next();
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                // check refreshToken
                if (req.body.refreshToken) {

                }
                // jwt exists, but refresh token does not exist: invalid request
                else return res.status(400).json({
                    success: false,
                    message: 
                })
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "invalid request",
                })
            }
        }
    }
}