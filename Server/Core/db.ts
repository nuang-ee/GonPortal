import mongoose from "mongoose";
import { INewbieAccount, NewbieAccountSchema } from "../Documents/Recruitment/AccountDocument";
import { INewbieRefreshToken, NewbieRefreshTokenSchema } from "../Documents/Recruitment/RefreshTokenDocument";
import { IRecruitCategory, RecruitCategorySchema } from "../Documents/Recruitment/CategoryDocument";
import { IRecruitChallenge, RecruitChallengeSchema } from "../Documents/Recruitment/ChallengeDocument";

const mongodbURI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/portal_newbie_dev';
const mongodbOption = {
    poolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    serverSelectionTimeoutMS: 3000
};

mongoose.connect(mongodbURI, mongodbOption)
    .then(() => console.log('Successfully connected to mongoDB'))
    .catch((err) => {
        console.log('Error on mongoDB connecting: ' + err.stack);
        process.exit(1);
});

export const NewbieAccount = mongoose.model<INewbieAccount>("NewbieAccount", NewbieAccountSchema);
export const NewbieRefreshToken = mongoose.model<INewbieRefreshToken>("NewbieRefreshToken", NewbieRefreshTokenSchema);
export const RecruitCategory = mongoose.model<IRecruitCategory>("RecruitCategory", RecruitCategorySchema);
export const RecruitChallenge = mongoose.model<IRecruitChallenge>("RecruitChallenge", RecruitChallengeSchema);
