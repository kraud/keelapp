const nodemailer = require("nodemailer")

module.exports = async(email, subject, text) => {
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
    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                console.log("Server is ready to take our messages")
                resolve(success)
            }
        })
    })

    const mailData = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text
    }

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                console.log(info)
                console.log("Email sent successfully")
                resolve(info)
            }
        })
    })
}