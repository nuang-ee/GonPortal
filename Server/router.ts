import * as express from "express";
import { RecruitRouter } from "./routes/RecruitRouter";

export const mainRouter = express.Router();

mainRouter.use("/recruit", RecruitRouter);
