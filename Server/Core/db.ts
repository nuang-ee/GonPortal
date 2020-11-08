import mongoose, {ConnectionOptions} from "mongoose";
import { IApplicantAccount, ApplicantAccountSchema } from "../Documents/Recruitment/AccountDocument";
import { IRefreshToken, RefreshTokenSchema } from "../Documents/Recruitment/RefreshTokenDocument";

const mongodbURI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/portal_newbie_dev';
const mongodbOption: ConnectionOptions = {
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

export const ApplicantAccount = mongoose.model<IApplicantAccount>("ApplicantAccount", ApplicantAccountSchema);
export const RecruitRefreshToken = mongoose.model<IRefreshToken>("RecruitRefreshToken", RefreshTokenSchema);
