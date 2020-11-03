const fs = require("fs");

module.exports = {
    transpileDependencies: ["vuetify"],
    devServer: {
        https: {
            key: fs.readFileSync("./keys/key.pem"),
            cert: fs.readFileSync("./keys/cert.pem"),
        },
    },
};
