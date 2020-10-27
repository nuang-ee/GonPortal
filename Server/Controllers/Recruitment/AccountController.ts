import * as express from "express";
import asyncHandler from "express-async-handler";
import { NewbieAccount } from "../../utils/db";
import { sendAuthMail, verifyAuthMail } from "../../utils/mailAuth";
import { Auth } from "../../Core/Auth";
import { NewbieAuth } from "../../Core/NewbieAuth";
import * as Mongoose from "mongoose";
import { INewbieAccount } from "../../Documents/Recruitment/AccountDocument";

export const AccountControlRouter = express.Router();

/* NEW ACCOUNT */
AccountControlRouter.post('/auth/register', asyncHandler(async (req, res) => {
    const { username, password, sNum, name, phoneNum } = req.body;
    let email = req.body.email;
    if ( !username || !password || !sNum || !name || !email || !phoneNum ) {
        return res.status(400).send("Invalid Request");
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid Email Form");
    }

    /* Only email domain is case insensitive per RFC 5321.
     * However many email service providers (including mail.kaist.ac.kr) also consider
     * user name as case insensitive - we follow this rule. */
    email = email.toLowerCase();

    const whiteList: string[] = ["kaist.ac.kr"];
    const emailDomain = email.split("@")[1];
    if (!whiteList.includes(emailDomain)) {
        return res.status(400).send("Sorry, we only allow KAIST students.");
    }

    // FIXME : edit response to show some toast popup or something, instead of raw text.
    if (await NewbieAccount.countDocuments({ username: username }) > 0) {
        return res.status(400).send("Username Already Exists");
    }

    if (await NewbieAccount.countDocuments({ sNum: sNum }) > 0) {
        return res.status(400).send("Already Registered Student");
    }

    if (await NewbieAccount.countDocuments({ email: email }) > 0) {
        return res.status(400).send("Already Registered email address");
    }

    const pwHash = await Auth.hash(req.body.password);

    const account = await NewbieAccount.create({
        role: 'guest',
        username: username,
        password: pwHash,
        sNum: sNum,
        name: name,
        email: email,
        emailAuthed: false,
        phoneNum: phoneNum,
        resume: "",
        solved: 0,
        created: Date.now()
    })

    sendAuthMail(account._id, email, (err, info) => { if (err) console.log(err, info) });
    
    return res.status(200).send("<p>Successfully added your account! Check your email to authenticate your account.</p>");
}));

AccountControlRouter.get('/auth/mail/resend', asyncHandler(async (req, res) => {
    if (!req.session) {
        return res.status(400).send("You haven't logged in");
    }

    const _id = req.session._id;
    if (!_id) return res.status(400).send("Invalid Session");

    const authed = req.session.Authed;
    if (authed) return res.status(200).send("Your Account has been already authorized!");

    const user = await NewbieAccount.findOne({ _id: _id });
    if (!user) return res.status(400).send("Invalid Session");
    if (user.emailAuthed) return res.status(200).send("Your Account has been already authorized!");

    sendAuthMail(_id, user.email, (err, info) => {if (err) console.log(err, info)});

    return res.status(200).send("<p>Sent Authentication Email! Check your email to authenticate your account.</p>");
}));

/* MAIL AUTHENTICATION */
AccountControlRouter.get('/auth/mail/verify', asyncHandler(async (req, res) => {
    const { iv, authCode, authTag } = req.query;

    if (typeof iv !== 'string' || typeof authCode !== 'string' || typeof authTag !== 'string') {
        return res.status(400).send("Mail authentication failed. Please check the verification link or resend verification mail.");
    }
    const authData = verifyAuthMail(iv as string, authCode as string, authTag as string);
    if (authData === undefined) {
        return res.status(400).send("Mail authentication failed. Please check the verification link or resend verification mail.");
    }

    const account = await NewbieAccount.findById(authData._id);
    if (account === null) {
        return res.status(400).send("Mail authentication failed. Please check the verification link or resend verification mail.");
    } else if (account.email !== authData.email) {
        return res.status(400).send("Mail authentication failed. Your email has been changed, please resend verification mail.");
    } else if (account.emailAuthed) {
        return res.status(400).send("Mail already authenticated.");
    }
    account.emailAuthed = true;

    await account.save();

    return res.status(200).send("Mail authenticated.");
}));

/* UPDATE ACCOUNT INFORMATION */
AccountControlRouter.put('/update/:id', asyncHandler(NewbieAuth.authenticate), asyncHandler(async (req, res) => {
    // TODO: add validation logic
    await NewbieAccount.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).send("Succeed to Update Account");
}));

/* LOGIN */
AccountControlRouter.post('/auth/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await NewbieAccount.findOne({username: username});
    if (!user || !(await Auth.isValid(password, user.password)))
        return res.status(400).send("invalid username or password");

    const {jwtToken, refreshToken} = await NewbieAuth.generateToken(user);
    const response = {
        "status": "Logged in",
        "token": jwtToken,
        "refreshToken": refreshToken.token,
    }
    res.cookie("token", jwtToken, { secure: true, httpOnly: true });
    res.cookie("refreshToken", refreshToken.token, { secure: true, httpOnly: true });
    return res.status(200).json(response);
}));

/* LOGOUT */
// TODO: change to jwt style
AccountControlRouter.get('/auth/logout', asyncHandler(async (req, res) => {
    if (!req.session) return res.status(400).send("You haven't logged in");

    const _id = req.session._id;
    if (!_id) return res.status(400).send("Invalid Session");

    req.session.destroy((err) => {
        if (err) {
            console.log("error on destroying session");
            return res.status(500).send("Error on Logout");
        }
        // if needed,
        // res.clearCookie('connect.sid');
        return res.status(200).send("Successfully logged out");
    })
}))
