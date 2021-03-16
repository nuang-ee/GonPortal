import * as express from "express";
import asyncHandler from "express-async-handler";
import * as Mongoose from "mongoose";
import { NewbieAccount, RecruitChallenge } from "../../Core/db";
import { INewbieAccount } from "../../Documents/Recruitment/AccountDocument";
import { IRecruitChallenge } from "../../Documents/Recruitment/ChallengeDocument";
import { Flag } from "../../Core/Flag";

export const ChallengeControlRouter = express.Router();

// FIXME: replace all response send, with proper vue.js actions.

/* GET BULK CHALLENGES */
ChallengeControlRouter.get('/', asyncHandler(async (req, res) => {
    const challenges = await RecruitChallenge
        .find({}, ['_id', 'title', 'category', 'difficulty'])
        .exec();

    return res.status(200).json(challenges);
}));


ChallengeControlRouter.get('/:_id', asyncHandler(async (req, res) => {
    const challengeId = req.params._id;

    const challenge = await RecruitChallenge
        .findById(challengeId, ['title', 'category', 'difficulty', 'description'])
        .exec();

    if (challenge === null) {
        return res.status(400).send("Challenge Not Exists");
    }
    else {
        return res.status(200).json(challenge);
    }
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

    const rawResult = await RecruitChallenge
        .findOneAndUpdate(
            { title: title, category: category },
            { $setOnInsert: { difficulty: difficulty, description: description, flag: flag } },
            { upsert: true, new: true, rawResult: true }
        )
        .exec();

    if (rawResult.lastErrorObject.updatedExisting) {
        return res.status(400).send("Challenge Already Exists");
    }

    const challenge = rawResult.value;
    return res.status(201).json(challenge);
}));

/* UPDATE CHALLENGE */
ChallengeControlRouter.put('/:_id', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.
    //
    const challengeId = req.params._id;

    const challenge = await RecruitChallenge
        .findByIdAndUpdate(challengeId, req.body, { new: true })
        .exec();

    if (challenge === null) {
        return res.status(400).send("Challenge Not Exists");
    }

    return res.status(200).json(challenge);
}));

/* REMOVE CHALLENGE */
ChallengeControlRouter.delete('/:_id', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.

    const challengeId = req.params._id;

    const challenge = await RecruitChallenge
        .findByIdAndDelete(challengeId)
        .exec();

    if (challenge === null) {
        return res.status(400).send("Challenge Not Exists");
    }

    res.status(200).json(challenge);
}));

/* SUBMIT FLAG */
// FIXME: change REST API URL with noun form.
ChallengeControlRouter.post('/submit/:_id', asyncHandler(async (req, res) => {
    const { flag } = req.body;
    const challengeId = req.params._id;

    const challenge = await RecruitChallenge
        .findById(challengeId, ['flag'])
        .exec();

    if (challenge === null) {
        return res.status(400).send("Challenge Not Exists");
    }

    if (challenge.flag !== flag) {
        return res.status(200).send("Wrong Flag");
    }

    // FIXME: find user with jwt session.
    const user = await NewbieAccount
        .findOneAndUpdate(
            {},
            { $addToSet: { solved: challengeId } },
            { new: true }
        )
        .exec();

    if (user === null) {
        return res.status(400).send("User Not Exists");
    }

    return res.status(200).send("Correct Flag");
}));
