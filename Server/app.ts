// get env settings from .env file, which should exist in same dir.
import * as dotenv from "dotenv"
dotenv.config();

import * as express from "express"
import * as bodyParser from "body-parser"
import session from "express-session"
import { KEY } from "./config"
import cors from "cors"
import { mainRouter } from "./router"

class App {
    public app: express.Application;

    public static bootstrap(): App {
        return new App();
    }

    constructor () {
        this.app = express.default();
    }
}

// dependencies.
const port = Number(process.env.PORT) || 80;

// Let's Run SErver!!
const app: express.Application = new App().app;

const mongoStore = require('connect-mongo')(session);
const mongodbURI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/portal_newbie_dev';

app.use(session({
    secret: KEY.sess_secret,
    resave: false, // save session only when modified.
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
    },
    store: new mongoStore({
        url: mongodbURI,
        collection: "sessions",
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// To enable CORS from frontend.
const corsOptions = {
    origin: process.env.FRONTEND_URI,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use("/", mainRouter);

app.listen(port, () => console.log(`server running on PORT ${port}`));