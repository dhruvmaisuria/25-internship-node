const mailer = require("nodemailer");

const sendingMail = async(to,subject,text) =>{

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user:"veerraar325@gmail.com",
            pass:"cxro obte apmi dmsm"
        }
    })

    const mailOptions = {
        from: 'veerraar325@gmail.com',
        to: to,
        subject: subject,
        text: text
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;
}

module.exports = {
    sendingMail
}