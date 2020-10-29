import * as express from "express";
import { AccountControlRouter } from "../Controllers/Recruitment/AccountController";
import { ChallengeControlRouter } from "../Controllers/Recruitment/ChallengeController";

export const RecruitRouter = express.Router();

RecruitRouter.use("/users", AccountControlRouter);
RecruitRouter.use("/challenge", ChallengeControlRouter);
