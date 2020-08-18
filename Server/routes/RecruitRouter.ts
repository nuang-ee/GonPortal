import * as express from "express";
import { AccountControlRouter } from "../Controllers/Recruitment/AccountController";

export const RecruitRouter = express.Router();

RecruitRouter.use("/users", AccountControlRouter);