"use strict";
const nodemailer = require('nodemailer');

const sendEmail = async(emails, asunto, texto) => {
    try {
        let testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.USER, // generated ethereal user
                pass: process.env.PASSWORD // generated ethereal password
            },
        });
        let info = await transporter.sendMail({
            from: "Fred Foo 👻", // sender address
            to: emails.toString(), // list of receivers
            subject: asunto, // Subject line
            text: texto // plain text body
                // html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    sendEmail
}