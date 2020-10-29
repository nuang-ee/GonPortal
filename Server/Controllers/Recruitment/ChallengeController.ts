import * as express from "express";
import asyncHandler from "express-async-handler";
import * as Mongoose from "mongoose";
import { NewbieAccount } from "../../utils/db";
import { INewbieAccount } from "../../Documents/Recruitment/AccountDocument";
import { RecruitChallenge } from "../../utils/db";
import { IRecruitChallenge } from "../../Documents/Recruitment/ChallengeDocument";

export const ChallengeControlRouter = express.Router();

// FIXME: replace all response send, with proper vue.js actions.

ChallengeControlRouter.post('/create', asyncHandler(async (req, res) => {
    return res.status(200).send("create");
}));

ChallengeControlRouter.post('/delete', asyncHandler(async (req, res) => {
    return res.status(200).send("delete");
}));

ChallengeControlRouter.post('/update', asyncHandler(async (req, res) => {
    return res.status(200).send("update");
}));

ChallengeControlRouter.post('/submit', asyncHandler(async (req, res) => {
    return res.status(200).send("submit");
}));
