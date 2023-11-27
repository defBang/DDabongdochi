const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
dotenv.config();

const transport = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

/** 메일 보내기 */
exports.sendEmail = (mailAddress, title, message, from = process.env.NODEMAILER_USER) => {

  const mailOptions = {
    from: from,
    to: mailAddress,
    subject: title,
    text: message,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("err", err);
      return;
    }

    console.log("ok", info);
  });
}

exports.generateRandomPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}