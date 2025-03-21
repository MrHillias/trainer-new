const nodemailer = require("nodemailer");
require("dotenv").config({ path: "env/.env.mail" });

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: process.env.MAIL_PORT == "465",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP-сервер доступен и работает!");
  } catch (error) {
    console.error("❌ Ошибка подключения к SMTP:", error);
  }
}

testSMTP();
