require("dotenv").config({ path: "env/.env.mail" });
const nodemailer = require("nodemailer");

console.log("MAIL_HOST:", process.env.MAIL_HOST);
console.log("MAIL_PORT:", process.env.MAIL_PORT);
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASSWORD:", process.env.MAIL_PASSWORD ? "****" : "NOT SET");

(async () => {
  try {
    console.log("Создаю транспорт...");
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true, // Yahoo требует secure = true для 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    console.log("Проверяю соединение...");
    await transporter.verify();
    console.log("✅ Подключение к SMTP успешно!");

    console.log("Отправляю тестовое письмо...");
    let info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER, // Отправим письмо самому себе
      subject: "Тестовое письмо от Node.js",
      text: "Если ты видишь это письмо, значит, соединение работает!",
    });

    console.log("✅ Письмо отправлено!", info.messageId);
  } catch (error) {
    console.error("❌ Ошибка:", error);
  }
})();
