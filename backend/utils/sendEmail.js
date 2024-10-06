const nodemailer = require("nodemailer")
const {resetPasswordHtmlComponent, getAttachmentsPasswordReset} = require("./resources/resetPassword")
const {verifyEmailHtmlComponent, getAttachmentsVerifyEmail} = require("./resources/verifyEmail");


function getHTMLAndAttachedData(emailData) {
    switch (emailData.type){
        case "resetPassword":
            return {
                html: resetPasswordHtmlComponent(emailData.name, emailData.url),
                attachments: getAttachmentsPasswordReset()
            }
        case "verifyEmail":
            return {
                html: verifyEmailHtmlComponent(emailData.name, emailData.url, emailData.email),
                attachments: getAttachmentsVerifyEmail()
            }
    }
}

module.exports = async(emailData) => {
    const transporter =  nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.EMAIL_SECURE),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }

    })
    const mailData = {
        from: process.env.EMAIL_USER,
        to: emailData.email,
        subject: emailData.subject,
        ...getHTMLAndAttachedData(emailData),
    }

    async function generateHtmlAndSend(emailData) {
        await transporter.sendMail(mailData)
            .then(info => {
                // console.log("info", info)
            })
            .catch(err => {
                console.log("error", err)
            })
    }
    await generateHtmlAndSend(emailData);
}