import * as express from "express";
import asyncHandler from "express-async-handler";
import * as Mongoose from "mongoose";
import { NewbieAccount, RecruitChallenge } from "../../utils/db";
import { INewbieAccount } from "../../Documents/Recruitment/AccountDocument";
import { IRecruitChallenge } from "../../Documents/Recruitment/ChallengeDocument";
import { Flag } from "../../Core/Flag";

export const ChallengeControlRouter = express.Router();

// FIXME: replace all response send, with proper vue.js actions.

ChallengeControlRouter.get('/:_id', asyncHandler(async (req, res) => {
    const _id = req.params._id;

    RecruitChallenge.findById(_id, (err, challenge) => {
        if (err) {
            console.error(err);
            res.status(500).send("Invalid Request");
        }
        else if (challenge === null) {
            res.status(400).send("Challenge Not Exists");
        }
        else {
            // TODO: send flag field only if the session is admin's.
            res.status(200).json(challenge);
        }
    });
}));

/* NEW CHALLENGE */
ChallengeControlRouter.post('/', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.

    const { title, category, difficulty, description, flag } = req.body;
    if (!title || !category || !difficulty || !description || !flag) {
        return res.status(400).send("Invalid Request");
    }

    if (!Flag.isValidFormat(flag)) {
        return res.status(400).send("Invalid Flag Format");
    }

    RecruitChallenge.findOneAndUpdate(
        { title: title, category: category },
        { $setOnInsert: { difficulty: difficulty, description: description, flag: flag } },
        { upsert: true, new: true, rawResult: true },
        (err, rawResult) => {
            if (err) {
                console.error(err);
                res.status(500).send("Invalid Request");
            }
            else if (rawResult.lastErrorObject.updatedExisting) {
                res.status(400).send("Challenge Already Exists");
            }
            else {
                const challenge = rawResult.value;
                res.status(201).send(`Challenge ${challenge?._id} Inserted`);
            }
        }
    );
}));

/* UPDATE CHALLENGE */
ChallengeControlRouter.put('/:_id', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.

    const _id = req.params._id;

    RecruitChallenge.findByIdAndUpdate(_id, req.body, {new: true},
        (err, challenge) => {
            if (err) {
                console.error(err);
                res.status(500).send("Invalid Request");
            }
            else if (challenge === null) {
                res.status(400).send("Challenge Not Exists");
            }
            else {
                res.status(200).send(`Challenge ${challenge._id} Updated`);
            }
        }
    );
}));

/* REMOVE CHALLENGE */
ChallengeControlRouter.delete('/:_id', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.

    const _id = req.params._id;

    RecruitChallenge.findByIdAndDelete(_id, (err, challenge) => {
        if (err) {
            console.error(err);
            res.status(500).send("Invalid Request");
        }
        else if (challenge === null) {
            res.status(400).send("Challenge Not Exists");
        }
        else {
            // TODO: send flag field only if the session is admin's.
            res.status(200).send(`Challenge ${challenge._id} Deleted`);
        }
    });
}));

/* SUBMIT FLAG */
/*
ChallengeControlRouter.post('/submit/:_id', asyncHandler(async (req, res) => {
    if (!req.session) {
        return res.status(400).send("You haven't logged in");
    }

    const _id = req.session._id;
    if (!_id) {
        return res.status(400).send("Invalid Session");
    }

    const user = await NewbieAccount.findById(_id);
    if (user === null) {
        return res.status(400).send("Invalid Session");
    }

    const { flag } = req.body;
    if (!flag) {
        return res.status(400).send("Invalid Request");
    }

    // FIXME: handle CastError with Model.findById() callback function.
    const challenge = await RecruitChallenge.findById(req.params._id, 'flag');
    if (challenge === null) {
        return res.status(400).send("Challenge Not Exists");
    }

    if (flag !== challenge.flag) {
        return res.status(200).send("Wrong Flag");
    }

    if (user.solved.includes(challenge._id)) {
        return res.status(200).send(`Challenge ${challenge._id} Already Solved`);
    }

    user.solved.push(challenge._id);
    await user.save();

    return res.status(200).send("Correct Flag");
}));
*/
