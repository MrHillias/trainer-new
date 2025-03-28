const nodemailer = require("nodemailer");
require("dotenv").config({
  path: __dirname + `/../env/.env.mail}`,
});

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = transporter;
