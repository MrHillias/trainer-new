const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Неверный email или пароль." });
    }

    if (!user.isConfirmed) {
      return res.status(400).json({ error: "Подтвердите email перед входом." });
    }

    // Сравниваем хэшированный пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Неверный email или пароль." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ message: "Вход выполнен успешно!", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
