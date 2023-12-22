const nodemailer = require("nodemailer");
const data = require("../../gmail/setup/token.json");

const sendEmail = async function ({ email, html }) {
  try {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_NAME,
          clientId: data.client_id,
          clientSecret: data.client_secret,
          refreshToken: data.refresh_token,
          // accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x',
          expires: 1484315697598
      }
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