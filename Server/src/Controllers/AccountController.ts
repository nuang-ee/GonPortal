import * as express from "express";
import asyncHandler from "express-async-handler";
import { NewbieAccount } from "../utils/db";
import { sendAuthMail, verifyAuthMail } from "../utils/mailAuth";
import { Auth } from "../Core/Auth";
import * as Mongoose from "mongoose";
import { INewbieAccount } from "../Documents/AccountDocument";

export const AccountControlRouter = express.Router();

// FIXME: replace all response send, with proper vue.js actions.

/* NEW ACCOUNT */
AccountControlRouter.post('/register', asyncHandler(async (req, res) => {
    const { uid, password, sNum, name, email, phoneNum } = req.body;
    if ( !uid || !password || !sNum || !name || !email || !phoneNum ) {
        return res.status(400).send("Invalid Request");
    }

    // FIXME : edit response to show some toast popup or something, instead of raw text.
    if (await NewbieAccount.countDocuments({ uid: uid }) > 0) {
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
        uid: uid,
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
AccountControlRouter.get('/auth/mail/:iv/:authCode/:authTag', asyncHandler(async (req, res) => {
    const { iv, authCode, authTag } = req.params;
    const authData = verifyAuthMail(iv, authCode, authTag);

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
AccountControlRouter.put('/update/:id', asyncHandler(async (req, res) => {
    // TODO: add validation logic
    await NewbieAccount.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).send("Succeed to Update Account");
}));

/* LOGIN */
AccountControlRouter.post('/auth/login', asyncHandler(async (req, res) => {
    const { uid, password } = req.body;

    if (req.session?._id) {
        return res.send('<h1>already Logged In</h1>');
    } else {
        const user = await NewbieAccount.findOne({uid: uid});
        if (!user?.password || !(await Auth.isValid(password, user.password)))
            return res.send("invalid username or password");
        
        if (!req.session) return res.status(400).send("invalid request");

        req.session._id = user._id;
        req.session.Authed = user.emailAuthed;
        req.session.LoggedIn = true;

        // req.session.save is done implicitly, on res.send
        // FIXME : redirect to main page.
        return res.send("you have logged in");
    }
}));

/* LOGOUT */
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
