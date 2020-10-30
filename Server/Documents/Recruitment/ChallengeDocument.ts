import * as mongoose from "mongoose";

export interface IRecruitChallenge extends mongoose.Document {
    title: string;
    category: IRecruitCategory['_id'];
    difficulty: number;
    description: string;
    // hint: Array<string>;
    flag: string;
}

export const RecruitChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'RecruitCategory', required: true },
    difficulty: { type: Number, required: true },
    description: { type: String, required: true },
    // hint: { type: String },
    flag: { type: String, required: true },
}, { collection: 'RecruitChallengeDocument' });

RecruitChallengeSchema.index({ name: 1, category: 1 }, { unique: true });

export interface IRecruitCategory extends mongoose.Document {
    name: string;
    challenges: Array<IRecruitChallenge['_id']>;
}

export const RecruitCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, index: 'hashed', unique: true },
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecruitChallenge' }],
}, { collection: 'RecruitCategoryDocument' });
