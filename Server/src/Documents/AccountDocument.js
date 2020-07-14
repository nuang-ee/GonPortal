const mongoose = require('mongoose');

// dependencies.
const crypto = require('crypto');

const NewbieAccountSchema = new mongoose.Schema({
    username: { type: String, required: true, index: 'hashed', unique: true },
    password: { type: String, required: true },
    sNum: { type: String, required: true },
    name: { type: String, required: true },
    phoneNum: { type: String, required: true },
    resume: { type: String },
    solved: { type: Number },
    created: { type: Date },
});

NewbieAccountSchema.methods.comparePassword = (username, pw, cb) => {
    const pwHash = crypto.createHmac('sha256', secret)
                        .update(pw).digest('base64');
    if (this.password === pwHash) cb(null, true);
    else cb('password')
}

module.exports = mongoose.model("NewbieAccount", NewbieAccountSchema);

