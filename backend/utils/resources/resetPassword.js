const path = require('path');

const resetPasswordHtmlComponent = (name, url) =>
{
    const myHtl = `
     <div>
        <img src="cid:logo" alt="Logo" style="max-width: 180px;"/>
        <h1>Hello ${name}</h1>
        <p>Click on the following link to reset your password: <a href="${url}"> here!</a></p>
        <p>If you didn't rquest this email, there's nothing to worry about - you can safely ignore it.</p>
        <p>Thank you!</p>
    </div>
    `;
    return myHtl;
};

const getAttachmentsPasswordReset = () => {
    return [
        {
            filename: 'logo.png',
            path: path.join(__dirname) + '/logo.png',
            cid: 'logo',
        }
    ]
}

module.exports = {
    resetPasswordHtmlComponent,
    getAttachmentsPasswordReset
}

