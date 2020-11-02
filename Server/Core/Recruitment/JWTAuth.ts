import * as jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../../config";
import { ApplicantAccount, RecruitRefreshToken } from "../db";
import { IApplicantAccount } from "../../Documents/Recruitment/AccountDocument";
import { Request, Response } from "express";
import { IRefreshToken } from "../../Documents/Recruitment/RefreshTokenDocument";

export interface IToken {
    username: string;
    role: string;
    emailAuthed: Boolean;
}

async function generateJwtToken(user: IApplicantAccount) {
    return jwt.sign(
        {
            username: user.username,
            role: user.role,
            emailAuthed: user.emailAuthed,
        },
        JWT_CONFIG.TOKEN_SECRET,
        { expiresIn: JWT_CONFIG.TOKEN_LIFE }
    );
}

async function generateRefreshToken(user: IApplicantAccount) {
    const refreshToken = await RecruitRefreshToken.create({
        username: user.username,
        token: jwt.sign(user.username, JWT_CONFIG.REFRESH_SECRET, {
            expiresIn: JWT_CONFIG.REFRESH_LIFE,
        }),
        expires: new Date(Date.now() + JWT_CONFIG.REFRESH_LIFE_NUM),
    });
    await refreshToken.save();
    return refreshToken;
}

export class JWTAuth {
    static async generateToken(user: IApplicantAccount) {
        const jwtToken = await generateJwtToken(user);
        const refreshToken = await generateRefreshToken(user);

        return { jwtToken, refreshToken };
    }

    /* must be called before the handler of every authentication-needed
     * requests */
    static async authenticate(req: Request, res: Response, next: Function) {
        const response = {
            success: false,
            message: "invalid request",
        };

        const token = req.headers["x-access-token"] as string;
        if (!token) {
            response.message = "not logged in";
            return res.status(401).json(response);
        }

        try {
            const userInfo = jwt.verify(
                token,
                JWT_CONFIG.TOKEN_SECRET
            ) as IToken;
            res.locals.tokenInfo = userInfo;
            next();
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                const givenRefreshToken = req.headers["x-refresh-token"] as string;
                try {
                    const decoded = jwt.verify(
                        givenRefreshToken,
                        JWT_CONFIG.REFRESH_SECRET
                    ) as IRefreshToken;
                    const stored = await RecruitRefreshToken.findOne({
                        username: decoded.username,
                    });
                    // if given refresh token is not valid or the old one
                    if (!stored || givenRefreshToken !== stored.token) {
                        response.message = "login expired";
                        return res.status(401).json(response);
                    }
                    const user = await ApplicantAccount.findOne({
                        username: decoded.username,
                    });
                    // refreshToken is in the database, but the owner is not in the database? wtf...
                    // Wooooahhhh!! Token with no owner~
                    if (!user) return res.status(400).json(response);

                    const newToken = await generateJwtToken(user);
                    res.locals.tokenInfo = {
                        username: user.username,
                        role: user.role,
                        emailAuthed: user.emailAuthed,
                    } as IToken;
                    res.cookie("token", newToken, {
                        secure: true,
                        httpOnly: true,
                    });
                    next();
                } catch (e) {
                    // if both tokens are expired
                    if (e instanceof jwt.TokenExpiredError) {
                        response.message = "login expired";
                        return res.status(401).json(response);
                    }
                    return res.status(400).json(response);
                }
            } else {
                return res.status(400).json(response);
            }
        }
    }
}
