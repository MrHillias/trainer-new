const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("../Models/User");
const transporter = require("../Utils/mailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "env/.env" });

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Хэшируем пароль перед сохранением
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создаем пользователя
    const confirmationToken = uuidv4();
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      confirmationToken,
    });

    // Генерируем ссылку для подтверждения email
    const confirmLink = `${process.env.APP_URL}/api/confirm/${confirmationToken}`;

    res.status(201).json({
      message: "Регистрация успешна! Подтвердите email по ссылке.",
      confirmLink, // Пока просто возвращаем ссылку, позже можно заменить на email-отправку
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/check-email", async (req, res) => {
  const { email } = req.query; // Извлекаем email из строки запроса

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.json({ exists: true, message: "Email уже используется" });
    } else {
      return res.json({ exists: false, message: "Email доступен" });
    }
  } catch (error) {
    console.error("Ошибка при проверке email:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
