import * as express from "express";
import asyncHandler from "express-async-handler";
import * as Mongoose from "mongoose";
import { RecruitCategory, RecruitChallenge } from "../../utils/db";
import { IRecruitCategory } from "../../Documents/Recruitment/CategoryDocument";
import { IRecruitChallenge } from "../../Documents/Recruitment/ChallengeDocument";

export const CategoryControlRouter = express.Router();

// FIXME: replace all response send, with proper vue.js actions.

CategoryControlRouter.post('/create/:name', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.

    const { name } = req.body;
    if (!name) {
        return res.status(400).send("Invalid Request");
    }

    if (await RecruitCategory.exists({ name: name })) {
        return res.status(400).send("Category Already Exists");
    }

    const category = await RecruitCategory.create({ name: name, challenges: [] });

    return res.status(200).send(`Category ${category._id} Created`);
}));

CategoryControlRouter.post('/delete/', asyncHandler(async (req, res) => {

}));

CategoryControlRouter.post('/challenges/', asyncHandler(async (req, res) => {
    // TODO: make sure that the session is admin's.
}));
