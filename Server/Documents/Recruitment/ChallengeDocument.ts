import * as mongoose from "mongoose";
import { IRecruitCategory } from "./CategoryDocument";

export interface IRecruitChallenge extends mongoose.Document {
    title: string;
    category: string;
    // category: IRecruitCategory['_id'];
    difficulty: number;
    description: string;
    // hint: Array<string>;
    flag: string;
}

export const RecruitChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    // category: { type: mongoose.Schema.Types.ObjectId, ref: 'RecruitCategory', required: true },
    difficulty: { type: Number, required: true },
    description: { type: String, required: true },
    // hint: [{ type: String }],
    flag: { type: String, required: true },
    // lock: { type: Boolean, required: true },
}, { collection: 'RecruitChallengeDocument' });

// RecruitChallengeSchema.index({ title: 1, category: 1 }, { unique: true });
