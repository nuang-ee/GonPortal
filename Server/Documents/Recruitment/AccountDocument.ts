import * as mongoose from "mongoose";

export interface IApplicantAccount extends mongoose.Document {
    role: string;
    username: string;
    password: string;
    name: string;
    phoneNum: string;
    sNum: string;
    email: string;
    emailAuthed: boolean;   // true if email is authorized via mailauth.
    created: Date;
    resume: string;
    solved: number;
}

export const ApplicantAccountSchema = new mongoose.Schema({
    role: { type: String, default: 'applicant', enum: ['applicant', 'admin'] },
    username: { type: String, required: true, index: 'hashed', unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phoneNum: { type: String, required: true },
    sNum: { type: String, required: true },
    email: { type: String, required: true },
    emailAuthed: { type: Boolean },
    created: { type: Date },
    resume: { type: String },
    solved: { type: Number },
}, { collection: 'ApplicantAccountDocument' });