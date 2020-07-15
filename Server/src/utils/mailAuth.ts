const nodemailer = require('nodemailer');

if (!(process.env.NODEMAILER_USERNAME && process.env.NODEMAILER_PASSWORD)) {
    console.log('env not set: nodemailer');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

exports.sendAuthMail = async function (userEmail: string) {
    const generatedKey = Math.floor(100000 + Math.random() * 900000).toString();
    await transporter.sendMail({
        from: `"KAIST GoN" < ${process.env.NODEMAILER_USERNAME}>`,
        to: userEmail,
        subject: 'GoN Newbie Recruiting Page Authentication',
        text: generatedKey,
        html: `<b>${generatedKey}<b>`,
    }, (err: Error, info: any) => {
        console.log(info.envelope);
        console.log(info.messageID);
        return false;
    });

    return true;
}