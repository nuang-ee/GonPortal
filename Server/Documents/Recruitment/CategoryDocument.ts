import * as mongoose from "mongoose";
import { IRecruitChallenge } from "./ChallengeDocument";

export interface IRecruitCategory extends mongoose.Document {
    name: string;
    challenges: Array<IRecruitChallenge['_id']>;
}

export const RecruitCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, index: 'hashed', unique: true },
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecruitChallenge', required: true }],
}, { collection: 'RecruitCategoryDocument' });
