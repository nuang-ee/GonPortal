import * as mongoose from "mongoose";
import { JWT_CONFIG } from "../../config"

export interface IRefreshToken extends mongoose.Document {
    username: string;
    token: string;
    expires: Date;
}

export const RefreshTokenSchema = new mongoose.Schema({
    username: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, expires: JWT_CONFIG.REFRESH_LIFE, default: Date.now }
}, { collection: 'RefreshTokenDocument' });