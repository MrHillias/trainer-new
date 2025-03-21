const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("../Models/User");
const transporter = require("../Utils/mailer");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Создаем пользователя
    const confirmationToken = uuidv4();
    const newUser = await User.create({
      name,
      email,
      password,
      confirmationToken,
    });

    // Генерируем ссылку для подтверждения email
    const confirmLink = `${process.env.APP_URL}/confirm/${confirmationToken}`;

    // Создаем JWT-токен
    const token = jwt.sign({ id: newUser.id, email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Регистрация успешна!",
      confirmLink,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
