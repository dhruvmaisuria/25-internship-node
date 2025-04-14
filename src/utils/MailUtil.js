const mailer = require("nodemailer");

const sendingMail = async(to,subject,text) =>{

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user:"legalconsultationteam@gmail.com",
            pass:"jmkg djfc fmti xefs"
        }
    })

    const mailOptions = {
        from: 'legalconsultationteam@gmail.com',
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
            user:"legalconsultationteam@gmail.com",
            pass:"jmkg djfc fmti xefs"
        }
    })

    const mailOptions = {
        from: 'legalconsultationteam@gmail.com',
        to: to,
        subject: subject,
        html:text
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log(mailResponse);
    return mailResponse;
}



module.exports = {
    sendingMail,forgotSendingMail,
}