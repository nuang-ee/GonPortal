import * as express from "express";
import asyncHandler from "express-async-handler";
import { ApplicantAccount } from "../../Core/db";
import { sendAuthMail, verifyAuthMail } from "../../Core/Recruitment/mailAuth";
import { Auth } from "../../Core/Auth";
import { JWTAuth, IToken } from "../../Core/Recruitment/JWTAuth";
import * as Mongoose from "mongoose";
import { IApplicantAccount } from "../../Documents/Recruitment/AccountDocument";

export const AccountControlRouter = express.Router();

/* NEW ACCOUNT */
AccountControlRouter.post(
    "/auth/register",
    asyncHandler(async (req, res) => {
        const response = {
            success: false,
            message: "",
        };

        const { username, password, sNum, name, phoneNum } = req.body;
        let email = req.body.email;
        if (!username || !password || !sNum || !name || !email || !phoneNum) {
            response.message = "invalid request";
            return res.status(400).json(response);
        }

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            response.message = "invalid email form";
            return res.status(400).json(response);
        }

        /* Only email domain is case insensitive per RFC 5321.
         * However many email service providers (including mail.kaist.ac.kr) also consider
         * user name as case insensitive - we follow this rule. */
        email = email.toLowerCase();

        const whiteList: string[] = ["kaist.ac.kr"];
        const emailDomain = email.split("@")[1];
        if (!whiteList.includes(emailDomain)) {
            response.message = "sorry, we only allow KAIST students.";
            return res.status(200).json(response);
        }

        // FIXME : edit response to show some toast popup or something, instead of raw text.
        if ((await ApplicantAccount.countDocuments({ username: username })) > 0) {
            response.message = "username already exists";
            return res.status(200).json(response);
        }

        if ((await ApplicantAccount.countDocuments({ sNum: sNum })) > 0) {
            response.message = "student already registered";
            return res.status(200).json(response);
        }

        if ((await ApplicantAccount.countDocuments({ email: email })) > 0) {
            response.message = "email already registered";
            return res.status(200).json(response);
        }

        const pwHash = await Auth.hash(req.body.password);

        const account = await ApplicantAccount.create({
            role: 'applicant',
            username: username,
            password: pwHash,
            name: name,
            phoneNum: phoneNum,
            sNum: sNum,
            email: email,
            emailAuthed: false,
            resume: "",
            solved: 0,
            created: Date.now(),
        });

        sendAuthMail(account._id, email, (err, info) => {
            if (err) console.log(err, info);
        });

        response.success = true;
        response.message = "successfully joined your account";
        return res.status(200).json(response);
    })
);

AccountControlRouter.get(
    "/auth/mail/resend",
    asyncHandler(JWTAuth.authenticate),
    asyncHandler(async (req, res) => {
        const response = {
            success: false,
            message: "invalid request",
        };

        const tokenInfo = res.locals.tokenInfo as IToken;
        if (!tokenInfo) {
            return res.status(400).json(response);
        }

        const authed = tokenInfo.emailAuthed;
        if (authed) {
            response.message = "already authorized";
            return res.status(400).json(response);
        }

        const user = await ApplicantAccount.findOne({
            username: tokenInfo.username,
        });
        if (!user) return res.status(400).json(response);
        if (user.emailAuthed) {
            response.message = "already authorized";
            return res.status(400).json(response);
        }

        sendAuthMail(user._id, user.email, (err, info) => {
            if (err) console.log(err, info);
        });

        response.success = true;
        response.message = "successfully sent authentication email";
        return res.status(200).json(response);
    })
);

/* MAIL AUTHENTICATION */
AccountControlRouter.get(
    "/auth/mail/verify",
    asyncHandler(JWTAuth.authenticate),
    asyncHandler(async (req, res) => {
        const { iv, authCode, authTag } = req.query;

        const response = {
            success: false,
            message: "",
        };
        if (
            typeof iv !== "string" ||
            typeof authCode !== "string" ||
            typeof authTag !== "string"
        ) {
            response.message =
                "Mail authentication failed. Please check the verification link or resend verification mail.";
            return res.status(400).json(response);
        }
        const authData = verifyAuthMail(
            iv as string,
            authCode as string,
            authTag as string
        );
        if (authData === undefined) {
            response.message =
                "Mail authentication failed. Please check the verification link or resend verification mail.";
            return res.status(400).json(response);
        }

        const account = await ApplicantAccount.findById(authData._id);
        if (!account || account.email !== authData.email) {
            response.message =
                "Mail authentication failed. Please check the verification link or resend verification mail.";
            return res.status(400).json(response);
        } else if (account.emailAuthed) {
            response.message = "Mail already authenticated.";
            return res.status(400).json(response);
        }
        account.emailAuthed = true;

        await account.save();

        response.success = true;
        response.message = "successfully authenticated mail address";
        return res.status(200).json(response);
    })
);

/* UPDATE ACCOUNT INFORMATION */
// TODO: add all changable field to be handled properly in this route
AccountControlRouter.put(
    "/update/:id",
    asyncHandler(JWTAuth.authenticate),
    asyncHandler(async (req, res) => {
        const response = {
            success: false,
            message: "invalid request",
        };

        const tokenInfo = res.locals.tokenInfo as IToken;
        if (!tokenInfo) {
            return res.status(400).send(response);
        }

        const user = await ApplicantAccount.findOne({
            username: tokenInfo.username,
        });
        if (!user) {
            return res.status(400).send(response);
        }

        // TODO: does this condition work properly?
        if ((user?._id as string) !== req.params.id) {
            return res.status(400).send(response);
        }

        const newValues: {
            password?: string;
            nickname?: string;
            phoneNum?: string;
            email?: string;
        } = {};
        if (user.password !== (await Auth.hash(req.body.password)))
            newValues.password = req.body.password;
        if (user.phoneNum !== req.body.phoneNum)
            newValues.phoneNum = req.body.phoneNum;
        if (user.email !== req.body.email) newValues.email = req.body.email;

        await ApplicantAccount.findByIdAndUpdate(req.params.id, req.body, {
            omitUndefined: true,
        });

        response.success = true;
        response.message = "successfully updated account";
        return res.status(200).send(response);
    })
);

/* LOGIN */
AccountControlRouter.post(
    "/auth/login",
    asyncHandler(async (req, res) => {
        const response = {
            success: false,
            message: "",
        };

        const { username, password } = req.body;
        if (!username || !password) {
            response.message = "invalid request";
            return res.status(400).json(response);
        }

        const user = await ApplicantAccount.findOne({ username: username });
        if (!user || !(await Auth.isValid(password, user.password))) {
            response.message = "invalid username or password";
            return res.status(400).json(response);
        }

        const { jwtToken, refreshToken } = await JWTAuth.generateToken(user);
        res.cookie("token", jwtToken, { secure: true, httpOnly: true });
        res.cookie("refreshToken", refreshToken.token, {
            secure: true,
            httpOnly: true,
        });

        response.success = true;
        response.message = "succesfully logged in";
        return res.status(200).json(response);
    })
);

/* LOGOUT */
// TODO: change to jwt style
// Removed, since it looked unnecessary in jwt style, but if needed,
// use this address as a logout route.
// AccountControlRouter.get('/auth/logout', asyncHandler(async (req, res) => {}))
