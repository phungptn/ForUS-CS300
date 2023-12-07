const nodemailer = require("nodemailer");

const sendEmail = async function ({ email, html }) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: '"ForUS" <no-reply@forus.com>', // sender address
      to: email, // list of receivers
      subject: "Forgot password", // Subject line
      html: html, // html body
    });

    return info;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = sendEmail;