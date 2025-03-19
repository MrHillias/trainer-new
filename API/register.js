const express = require("express");
const router = express.Router();
const User = require("../Models/User"); // Импортируем модель пользователя

// Маршрут регистрации пользователя
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
