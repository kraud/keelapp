const path = require('path');

const verifyEmailHtmlComponent = (name, url, email) =>
{
    const myHtl = `
     <div>
        <img src="cid:logo" alt="Logo" style="max-width: 180px;"/>
        <h1>Hello ${name}</h1>
        <p>Once you have confirmed that ${email} is your email address, you will be able to use our platform.</p>
        <p>Click on the following link to verify your email: <a href="${url}"> here!</a></p>
        <p>Thank you!</p>
    </div>
    `;
    return myHtl;
};

const getAttachmentsVerifyEmail = () => {
    return [
        {
            filename: 'logo.png',
            path: path.join(__dirname) + '/logo.png',
            cid: 'logo',
        }
    ]
}

module.exports = {
    verifyEmailHtmlComponent,
    getAttachmentsVerifyEmail
}

