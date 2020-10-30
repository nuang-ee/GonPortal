import * as mongoose from "mongoose";

export interface IRecruitChallenge extends mongoose.Document {
    name: string;
    category: string;
    difficulty: number;
    description: string;
    // hint: Array<string>;
    flag: string;
}

export const RecruitChallengeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: Number, required: true },
    description: { type: String, required: true },
    // hint: { type: String },
    flag: { type: String, required: true },
}, { collection: 'RecruitChallengeDocument' });

RecruitChallengeSchema.index({ name: 1, category: 1 }, { unique: true });

/*
export interface IRecruitCategory extends mongoose.Document {

}

export const RecruitCategorySchema = new mongoose.Schema({

}, { collection: 'RecruitCategoryDocument' });
*/
