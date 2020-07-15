import * as express from "express";
// mongoose model of account schema.
import { NewbieAccount, secret } from "../utils/db";

// Dependencies.
import * as crypto from "crypto";
import * as Mongoose from "mongoose";
import { INewbieAccount } from "../Documents/AccountDocument";

export const AccountControlRouter = express.Router();

/* NEW ACCOUNT */
AccountControlRouter.post('/register', (req, res) => {
    if ( !req || !req.body || !req.body.uid || !req.body.password || !req.body.sNum ||
        !req.body.name || !req.body.email || !req.body.phoneNum ) {
        res.status(400).send("Invalid Request");
    }

    // FIXME : edit response to show some toast popup or something, instead of raw text.
    NewbieAccount.countDocuments({ uid : req.body.uid }, (err: any, count) => {
        if (count > 0) res.status(400).send("Username Already Exists");
    })

    NewbieAccount.countDocuments({ sNum : req.body.sNum }, (err: any, count) => {
        if (count > 0) res.status(400).send("Already Registered Student");
    })

    NewbieAccount.countDocuments({ email : req.body.email }, (err: any, count) => {
        if (count > 0) res.status(400).send("Already Registered email address");
    })

    const pwHash = crypto.createHmac('sha256', secret)
        .update(req.body.password)
        .digest('base64');

    NewbieAccount.create(
    {
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
    }, (err: any, Account: any) => {
        if (err) return res.status(500).send("Failed to Add Account");
        res.status(200).send("<p>Successfully added your account! Check your email to authenticate your account.</p>");
    });
});

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


