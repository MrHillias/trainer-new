const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./Utils/db_launch"); // Просто импортируем, он сам подключается
const User = require("./Models/User");

const app = express();
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
