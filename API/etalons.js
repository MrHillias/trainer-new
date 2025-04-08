const express = require("express");
const router = express.Router();

const SomeBook = require("../Models/SomeBooks");
const SomeFlight = require("../Models/someFlights");
const SomeUser = require("../Models/someUsers");

// GET: Получить все книги
router.get("/books", async (req, res) => {
  try {
    const books = await SomeBook.findAll(); // Получаем все записи из таблицы SomeBook
    res.json(books); // Отправляем их в ответе
  } catch (error) {
    console.error("Ошибка при получении книг:", error);
    res.status(500).json({ error: "Ошибка при получении данных о книгах" });
  }
});

// GET: Получить книгу по ID
router.get("/books/:id", async (req, res) => {
  try {
    const book = await SomeBook.findByPk(req.params.id); // Ищем книгу по ID
    if (!book) {
      return res.status(404).json({ error: "Книга не найдена" });
    }
    res.json(book); // Отправляем книгу в ответе
  } catch (error) {
    console.error("Ошибка при получении книги:", error);
    res.status(500).json({ error: "Ошибка при получении данных о книге" });
  }
});

// GET: Получить все рейсы
router.get("/flights", async (req, res) => {
  try {
    const flights = await SomeFlight.findAll(); // Получаем все записи из таблицы SomeFlight
    res.json(flights); // Отправляем их в ответе
  } catch (error) {
    console.error("Ошибка при получении рейсов:", error);
    res.status(500).json({ error: "Ошибка при получении данных о рейсах" });
  }
});

// GET: Получить рейс по ID
router.get("/flights/:id", async (req, res) => {
  try {
    const flight = await SomeFlight.findByPk(req.params.id); // Ищем рейс по ID
    if (!flight) {
      return res.status(404).json({ error: "Рейс не найден" });
    }
    res.json(flight); // Отправляем рейс в ответе
  } catch (error) {
    console.error("Ошибка при получении рейса:", error);
    res.status(500).json({ error: "Ошибка при получении данных о рейсе" });
  }
});

// GET: Получить все пользователей
router.get("/users", async (req, res) => {
  try {
    const users = await SomeUser.findAll(); // Получаем все записи из таблицы SomeUser
    res.json(users); // Отправляем их в ответе
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res
      .status(500)
      .json({ error: "Ошибка при получении данных о пользователях" });
  }
});

// GET: Получить пользователя по ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await SomeUser.findByPk(req.params.id); // Ищем пользователя по ID
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.json(user); // Отправляем пользователя в ответе
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res
      .status(500)
      .json({ error: "Ошибка при получении данных о пользователе" });
  }
});

module.exports = router;
