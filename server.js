const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./Utils/db_launch");

// Загружаем переменные окружения
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: `./env/${envFile}` });

const app = express();
app.use(bodyParser.json());

// Подключаем API маршруты
app.use("/api/register", require("./API/register"));
app.use("/api/confirm", require("./API/confirm"));

//Настройка путей
const authRoutes = require("./Routes/auth");
const userRoutes = require("./Routes/user");
const tasksRoutes = require("./API/tasks");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", tasksRoutes);

// Обработка GET-запроса к корневому маршруту
app.get("/", (req, res) => {
  res.send("Фудж, соси новый хуец");
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен успешно на порту ${PORT}`);
});
