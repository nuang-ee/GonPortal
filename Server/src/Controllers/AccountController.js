const express = require('express');
const router = express.Router();

// import DB configuration
const dbConfig = require('../config');

// mongoose model of account schema.
const Account = require('../Documents/AccountDocument');

// Dependencies.
const crypto = require('crypto');
const { Mongoose } = require('mongoose');
const secret = dbConfig.KEY.secret

/* Helper function for finding preexisting id */
function find (name, callback) {
    Mongoose.connection.db.collection(name)
}

/* NEW ACCOUNT */
router.post('/register', (req, res) => {
    Account.count({username:req.body.username}, (err, count) => {
        if (count > 0) res.status(400).send("Username Already Exists");
    })

    Account.count({sNum:req.body.sNum}, (err, count) => {
        if (count > 0) res.status(400).send("Already Registered Student");
    })

    const pwHash = crypto.createHmac('sha256', secret)
        .update(req.body.password)
        .digest('base64');

    Account.create(
    {
        username: req.body.username,
        password: pwHash,
        sNum: req.body.sNum,
        name: req.body.name,
        phoneNum: req.body.phoneNum,
        resume: "",
        solved: false,
        created: Date.now()
    }, (err, Account) => {
        if (err) return res.status(500).send("Failed to Add Account");
        res.status(200).send("<p>Successfully added your account!</p>");
    });
});

/* UPDATE ACCOUNT INFORMATION */
router.put('/update/:id', (req, res) => {
    Account.findByIdAndUpdate(req.params.id, req.body, {new: true},
        (err, Account) => {
            if (err) return res.status(500).send("Failed to Update Account");
            res.status(200).send(user);
        });
});

/* LOGIN */
router.post('/auth/login', (req, res) => {

});

module.exports = router;

