const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("../Models/User");
const transporter = require("../Utils/mailer");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка на существование пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Этот email уже зарегистрирован." });
    }

    // Создаем пользователя с токеном подтверждения
    const confirmationToken = uuidv4();
    const newUser = await User.create({
      name,
      email,
      password,
      confirmationToken,
    });

    // Отправляем письмо с подтверждением
    const confirmLink = `${process.env.APP_URL}/confirm/${confirmationToken}`;
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Подтверждение регистрации",
      html: `<p>Здравствуйте, ${name}!</p>
             <p>Пожалуйста, подтвердите вашу регистрацию, перейдя по ссылке:</p>
             <a href="${confirmLink}">${confirmLink}</a>`,
    });

    res
      .status(201)
      .json({
        message: "Регистрация успешна! Проверьте вашу почту для подтверждения.",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
