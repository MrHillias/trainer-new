const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./Utils/db_launch");
const User = require("./Models/User");

// Определение окружения и загрузка соответствующего .env
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: `./env/${envFile}` });

const app = express();
app.use(bodyParser.json());

// Пример маршрута регистрации
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Фудж, соси хуец");
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
