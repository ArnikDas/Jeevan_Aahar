import Mailgen from "mailgen";

import nodemailer from "nodemailer";

//for sending emails these much configuration is needed
const sendEmail = async(options )=>{
    const mailGenerator = new Mailgen({
        theme:"default",
        product: {
            name : "Task Maneger",
            link : "https://taskmanagelink.com"
        }
    })

   const emailTextual =  mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML =  mailGenerator.generateHtml(options.mailgenContent);

//it is the methode to send email
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS
    }
});

//creating a mail object
const mail = {
    from : "mail.taskmanager@gmail.com",
    to : options.email,
    subject : options.subject,
    text : emailTextual,
    html : emailHTML
};

//sending a mail(it need a .send method)
//mails has the tendency to fail
try {
   await transporter.sendMail(mail);
} catch (error) {
   console.error("Error sending email:", error);
}

};

//content of emails
const emailVerificationMailgenContent = (username,verificationUrl) => {
    return {
        body:{
            name:username,
            intro:"Welcome to our App!We'are excited to have you on board.",
            action:{
                instructions : "To verify your email please click on the following button",
                button : {
                    color : "#22BC66",
                    text : "Verify your Email",
                    link : verificationUrl
                },
            },
            outro : " Need Help, or Have questions?just reply to this email,we'd love to help"
        },
    };

};

const forgotPasswordMailgenContent = (username,passwordResetUrl) => {
    return {
        body:{
            name:username,
            intro:"We got a request to reset the password of your account.",
            action:{
                instructions : "to reset your password click on the following button or link",
                button : {
                    color : "#22BC66",
                    text : "Reset Password",
                    link : passwordResetUrl
                },
            },
            outro : " Need Help, or Have questions?just reply to this email,we'd love to help"
        },
    };

};

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
};