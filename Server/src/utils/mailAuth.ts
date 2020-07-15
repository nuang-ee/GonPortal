import * as nodemailer from "nodemailer";

if (!process.env.NODEMAILER_USERNAME || !process.env.NODEMAILER_PASSWORD) {
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

export async function sendAuthMail(userEmail: string): Promise<any> {
    const generatedKey = Math.floor(100000 + Math.random() * 900000).toString();
    return transporter.sendMail({
        from: `"KAIST GoN" < ${process.env.NODEMAILER_USERNAME}>`,
        to: userEmail,
        subject: 'GoN Newbie Recruiting Page Authentication',
        text: generatedKey,
        html: `<b>${generatedKey}<b>`,
    });
}