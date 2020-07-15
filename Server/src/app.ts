// get env settings from .env file, which should exist in same dir.
import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import { AccountControlRouter } from "./Controllers/AccountController";
import * as bodyParser from "body-parser";

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", AccountControlRouter);

app.listen(port, () => console.log(`server running on PORT ${port}`));