const mailer = require("nodemailer");

const sendingMail = async(to,subject,text) =>{

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user:"toxicfreefire3010@gmail.com",
            pass:"kzaw dupa kkhl jdhz"
        }
    })

    const mailOptions = {
        from: 'toxicfreefire3010@gmail.com',
        to: to,
        subject: subject,
        text: text
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;
}

const forgotSendingMail = async(to,subject,text) =>{

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user:"toxicfreefire3010@gmail.com",
            pass:"kzaw dupa kkhl jdhz"
        }
    })

    const mailOptions = {
        from: 'toxicfreefire3010@gmail.com',
        to: to,
        subject: subject,
        html: text
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log(mailResponse);
    return mailResponse;
}

module.exports = {
    sendingMail,forgotSendingMail
}