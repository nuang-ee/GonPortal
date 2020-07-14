// get env settings from .env file, which should exist in same dir.
require('dotenv').config();

// dependencies.
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const AccountController = require('./Controllers/AccountController');

const app = express();
const port = process.env.PORT || 80;
const mongoURI = process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27017/portal_newbie_dev';

// Let's Run SErver!!
const server = app.listen(port, () => console.log('server running on PORT ' + port));

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Successfully connected to mongoDB'))
    .catch((err) => {
        console.log('Error on mongoDB connecting: ' + err.stack);
        process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.use('/users', AccountController);
