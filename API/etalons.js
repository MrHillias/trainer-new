const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const SomeBook = require("../Models/SomeBooks");
const SomeFlight = require("../Models/SomeFlights");
const SomeUser = require("../Models/SomeUsers");

// GET: Поиск книг по части строки (в авторе или названии)
router.get("/books/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Не указана строка поиска" });
    }

    const books = await SomeBook.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { author: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    res.json(books);
  } catch (error) {
    console.error("Ошибка при поиске книг:", error);
    res.status(500).json({ error: "Ошибка при поиске книг" });
  }
});

// GET: Посчитать количество отфильтрованных книг
router.get("/books/count", async (req, res) => {
  console.log("Запрос:", req.query); // Выведет все параметры запроса

  try {
    const filters = {}; // Собираем фильтры так же, как в /books

    if (req.query.price) filters.price = parseFloat(req.query.price); // Преобразуем цену в число
    if (req.query.author) filters.author = req.query.author;
    if (req.query.genre) filters.genre = req.query.genre;
    if (req.query.year) filters.year = parseInt(req.query.year, 10); // Преобразуем год в число
    if (req.query.language) filters.language = req.query.language;

    console.log("Фильтры для запроса:", filters); // Логируем фильтры

    const count = await SomeBook.count({ where: filters });
    res.json({ count });
  } catch (error) {
    console.error("Ошибка при подсчёте книг:", error); // Логирование ошибки
    res.status(500).json({ error: "Ошибка при подсчёте книг" });
  }
});

// GET: Получить книгу по ID или все книги
router.get("/books", async (req, res) => {
  try {
    const { id } = req.query; // Параметр id из query string

    if (id) {
      // Если передан параметр id, получаем книги по этим ID
      const bookIds = id.split(",").map((id) => parseInt(id, 10)); // Разделяем строку на массив чисел
      if (bookIds.some((id) => isNaN(id))) {
        return res.status(400).json({ error: "Invalid book ID(s)" });
      }

      // Ищем книги по множеству ID
      const books = await SomeBook.findAll({
        where: {
          id: bookIds, // Используем оператор IN
        },
      });

      if (books.length === 0) {
        return res.status(404).json({ error: "Книги не найдены" });
      }

      return res.json(books); // Отправляем книги в ответе
    }

    // Если id нет, получаем все книги с фильтрами и сортировкой
    const {
      author,
      genre,
      price,
      availability,
      year,
      rating_gte,
      rating_lte,
      language,
      sortField, // Параметры сортировки
      sortOrder, // Параметры сортировки
    } = req.query;

    const filters = {};

    // Применяем фильтры
    if (author) filters.author = author;
    if (genre) filters.genre = genre;
    if (price) filters.price = parseFloat(price); // Преобразуем в число
    if (availability) filters.availability = availability;
    if (year) filters.year = parseInt(year, 10); // Преобразуем в целое число
    if (language) filters.language = language;

    if (rating_gte || rating_lte) {
      filters.rating = {};
      if (rating_gte) filters.rating[Op.gte] = parseFloat(rating_gte);
      if (rating_lte) filters.rating[Op.lte] = parseFloat(rating_lte);
    }

    // Проверка и настройка сортировки
    const order = [];
    if (sortField && sortOrder) {
      const validFields = ["title", "author", "price", "year", "rating"];
      const validOrders = ["asc", "desc"];

      if (validFields.includes(sortField) && validOrders.includes(sortOrder)) {
        order.push([sortField, sortOrder]);
      } else {
        return res.status(400).json({ error: "Invalid sort parameters" }); // Возвращаем ошибку при неверных параметрах сортировки
      }
    }

    const books = await SomeBook.findAll({
      where: filters,
      order: order, // Добавляем сортировку в запрос
    });

    res.json(books);
  } catch (error) {
    console.error("Ошибка при получении книг:", error);
    res.status(500).json({ error: "Ошибка при получении данных о книгах" });
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
