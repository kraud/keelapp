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

    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                resolve(success)
            }
        })
    })

    async function generateHtmlAndSend(emailData) {
        // const filePath = path.join(__dirname, '/resources/');
        // await fs.readFile(filePath + emailData.type + '.html', 'utf8', (err, html) => {
        //     if (err) {
        //         console.log('Error loading template:', err)
        //         return ""
        //     }
        //
        //     // Replace variables in the template
        //     mailData.html = html
        //         .replace('{{replace-url}}', emailData.url)
        //         .replace('{{replace-name}}', emailData.name)
        //         .replace('{{replace-resources}}', filePath)

        console.log(mailData)
        new Promise(async (resolve, reject) => {
            await transporter.sendMail(mailData, (err, info) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    console.log(info)
                    resolve(info)
                }
            })
        })
    }
    await generateHtmlAndSend(emailData);
}