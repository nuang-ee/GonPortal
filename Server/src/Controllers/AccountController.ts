import * as express from "express";
import asyncHandler from "express-async-handler";
import { NewbieAccount, secret } from "../utils/db";
import * as crypto from "crypto";
import * as Mongoose from "mongoose";
import { INewbieAccount } from "../Documents/AccountDocument";

export const AccountControlRouter = express.Router();

/* NEW ACCOUNT */
AccountControlRouter.post('/register', asyncHandler(async (req, res) => {
    if ( !req || !req.body || !req.body.uid || !req.body.password || !req.body.sNum ||
        !req.body.name || !req.body.email || !req.body.phoneNum ) {
        return res.status(400).send("Invalid Request");
    }

    // FIXME : edit response to show some toast popup or something, instead of raw text.
    if (await NewbieAccount.countDocuments({ uid : req.body.uid }) > 0)
        return res.status(400).send("Username Already Exists");

    if (await NewbieAccount.countDocuments({ sNum : req.body.sNum }) > 0)
        return res.status(400).send("Already Registered Student");

    if (await NewbieAccount.countDocuments({ email : req.body.email }) > 0)
        return res.status(400).send("Already Registered email address");

    const pwHash = crypto.createHmac('sha256', secret)
        .update(req.body.password)
        .digest('base64');

    await NewbieAccount.create({
        uid: req.body.uid,
        password: pwHash,
        sNum: req.body.sNum,
        name: req.body.name,
        email: req.body.email,
        emailAuthed: false,
        phoneNum: req.body.phoneNum,
        resume: "",
        solved: 0,
        created: Date.now()
    })
    
    return res.status(200).send("<p>Successfully added your account! Check your email to authenticate your account.</p>");
}));

/* UPDATE ACCOUNT INFORMATION */
AccountControlRouter.put('/update/:id', (req, res) => {
    NewbieAccount.findByIdAndUpdate(req.params.id, req.body, {new: true},
        (err, Account) => {
            if (err) return res.status(500).send("Failed to Update Account");
            res.status(200).send("Succeed to Update Account");
        });
});

/* LOGIN */
AccountControlRouter.post('/auth/login', (req, res) => {

});


