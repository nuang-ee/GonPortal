import * as jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config";
import { NewbieAccount, NewbieRefreshToken } from "../utils/db";
import { INewbieAccount } from "../Documents/Recruitment/AccountDocument";
import { Request, Response } from "express";
import { INewbieRefreshToken } from "../Documents/Recruitment/RefreshTokenDocument";


interface IToken {
    id: string;
    role: string;
    emailAuthed: Boolean;

}
async function generateJwtToken(user: INewbieAccount) {
    return jwt.sign({ id: user.username, role: user.role, emailAuthed: user.emailAuthed },
                JWT_CONFIG.TOKEN_SECRET,
                { expiresIn: JWT_CONFIG.TOKEN_LIFE });
}

async function generateRefreshToken(user: INewbieAccount) {
    const refreshToken = await NewbieRefreshToken.create({
        username: user.username,
        token: jwt.sign(user.username, JWT_CONFIG.REFRESH_SECRET,
                        { expiresIn: JWT_CONFIG.REFRESH_LIFE }),
        expires: new Date(Date.now() + JWT_CONFIG.REFRESH_LIFE_NUM),
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
        // || req.query.token || req.body.token) as string;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'not logged in',
            })
        }

        try {
            const userInfo = jwt.verify(token, JWT_CONFIG.TOKEN_SECRET) as IToken;
            res.locals.tokenInfo = userInfo;
            next();
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                const givenRefreshToken = req.headers['x-refresh-token'] as string;
                try {
                    const decoded = jwt.verify(givenRefreshToken, JWT_CONFIG.REFRESH_SECRET) as INewbieRefreshToken;
                    const stored = await NewbieRefreshToken.findOne({ username: decoded.username });
                    // if given refresh token is not valid or the old one
                    if (!stored || givenRefreshToken !== stored.token) {
                        return res.status(401).json({
                            success: false,
                            message: "Login expired. Please sign-in again."
                        })
                    }
                    const user = await NewbieAccount.findOne({ username: decoded.username });
                    // refreshToken is in the database, but the owner is not in the database? wtf...
                    // Wooooahhhh!! Token with no owner~
                    if (!user) return res.status(500);

                    const newToken = await generateJwtToken(user);
                    res.cookie("token", newToken, { secure: true, httpOnly: true });
                    next();
                } catch (e) {
                    // if both tokens are expired
                    if (e instanceof jwt.TokenExpiredError) {
                        return res.status(401).json({
                            success: false,
                            message: "Login expired. Please sign-in again."
                        })
                    }
                    return res.status(400).json({
                        success: false,
                        message: "invalid request"
                    })
                }
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