import * as mongoose from "mongoose";

export interface IRecruitChallenge extends mongoose.Document {
    name: string;
    description: string;
    flag: string;
    score: number;
}

export const RecruitChallengeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    flag: { type: String, required: true },
    score: { type: Number, required: true },
}, { collection: 'RecruitChallengeDocument' });
