import * as express from "express";
import asyncHandler from "express-async-handler";
import * as Mongoose from "mongoose";
import { NewbieAccount } from "../../utils/db";
import { INewbieAccount } from "../../Documents/Recruitment/AccountDocument";
import { RecruitChallenge } from "../../utils/db";
import { IRecruitChallenge } from "../../Documents/Recruitment/ChallengeDocument";
import { Flag } from "../../Core/Flag";

export const ChallengeControlRouter = express.Router();

// FIXME: replace all response send, with proper vue.js actions.

ChallengeControlRouter.post('/create', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.

    const { name, category, difficulty, description, flag } = req.body;
    if (!name || !category || !difficulty || !description || !flag) {
        return res.status(400).send("Invalid Request");
    }

    if (!Flag.isValidFormat(flag)) {
        return res.status(400).send("Invalid Flag Format");
    }

    if (await RecruitChallenge.countDocuments({ name: name, category: category }) > 0) {
        return res.status(400).send("Challenge Already Exists");
    }

    const challenge = await RecruitChallenge.create({
        name: name,
        category: category,
        difficulty: difficulty,
        description: description,
        flag: flag
    });

    return res.status(200).send(`Challenge ${challenge._id} Created`);
}));

ChallengeControlRouter.get('/delete/:_id', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.

    const _id = req.params._id;

    // FIXME: handle CastError with Model.exists() callback function.
    if (!await RecruitChallenge.exists({ _id: _id })) {
        return res.status(400).send("Challenge Not Exists");
    }

    await RecruitChallenge.remove({ _id: _id });

    return res.status(200).send(`Challenge ${_id} Deleted`);
}));

ChallengeControlRouter.post('/update/:_id', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.

    const _id = req.params._id;

    const { name, category, difficulty, description, flag } = req.body;
    if (!name || !category || !difficulty || !description || !flag) {
        return res.status(400).send("Invalid Request");
    }

    // FIXME: handle CastError with Model.exists() callback function.
    if (!await RecruitChallenge.exists({ _id: _id })) {
        return res.status(400).send("Challenge Not Exists");
    }

    await RecruitChallenge.findByIdAndUpdate(_id, req.body);

    return res.status(200).send(`Challenge ${_id} Updated`);
}));

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
