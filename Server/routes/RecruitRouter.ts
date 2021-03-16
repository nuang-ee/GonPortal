import * as express from "express";
import { AccountControlRouter } from "../Controllers/Recruitment/AccountController";
import { CategoryControlRouter } from "../Controllers/Recruitment/CategoryController";
import { ChallengeControlRouter } from "../Controllers/Recruitment/ChallengeController";

export const RecruitRouter = express.Router();

RecruitRouter.use("/users", AccountControlRouter);
RecruitRouter.use("/categories", CategoryControlRouter);
RecruitRouter.use("/challenges", ChallengeControlRouter);
