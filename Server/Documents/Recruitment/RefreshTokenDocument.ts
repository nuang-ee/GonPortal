import * as mongoose from "mongoose";

export interface INewbieRefreshToken extends mongoose.Document {
    user: string;
    token: string;
    expires: Date;
}

export const NewbieRefreshTokenSchema = new mongoose.Schema({
    user: { type: String, required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true}
}, { collection: 'NewbieRefreshTokenDocument' });