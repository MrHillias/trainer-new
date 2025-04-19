const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const SomeBook = require("../Models/SomeBooks");
const SomeFlight = require("../Models/SomeFlights");
const SomeUser = require("../Models/SomeUsers");

// Пример PUT-запроса через query-параметры
router.put("/books", async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      price,
      availability,
      year,
      rating,
      language,
    } = req.query;

    if (
      !title ||
      !author ||
      !genre ||
      !price ||
      !availability ||
      !year ||
      !rating ||
      !language
    ) {
      return res.status(400).json({ error: "Отсутствуют обязательные поля" });
    }

    const newBook = {
      title,
      author,
      genre,
      price: parseFloat(price),
      availability,
      year: parseInt(year, 10),
      rating: parseFloat(rating),
      language,
    };

    // Получаем список всех книг
    const books = await SomeBook.findAll();

    // "Как бы" добавляем новую книгу
    const simulatedList = [...books.map((book) => book.toJSON()), newBook];

    res.json(simulatedList);
  } catch (error) {
    console.error("Ошибка при симуляции PUT-запроса:", error);
    res.status(500).json({ error: "Ошибка при симуляции PUT-запроса" });
  }
});

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

    // Преобразуем параметры, если они присутствуют в запросе
    if (req.query.price) filters.price = parseFloat(req.query.price); // Преобразуем цену в число
    if (req.query.author) filters.author = req.query.author;
    if (req.query.genre) filters.genre = req.query.genre;
    if (req.query.year) filters.year = parseInt(req.query.year, 10); // Преобразуем год в число
    if (req.query.language) filters.language = req.query.language;

    // Добавляем фильтры для рейтинга, если параметры присутствуют
    if (req.query.rating_gte) {
      filters.rating = {
        ...filters.rating,
        [Op.gte]: parseFloat(req.query.rating_gte),
      };
    }
    if (req.query.rating_lte) {
      filters.rating = {
        ...filters.rating,
        [Op.lte]: parseFloat(req.query.rating_lte),
      };
    }

    console.log("Фильтры для запроса:", filters); // Логируем фильтры

    const count = await SomeBook.count({ where: filters });
    res.json({ count });
  } catch (error) {
    console.error("Ошибка при подсчёте книг:", error); // Логирование ошибки
    res.status(500).json({ error: "Ошибка при подсчёте книг" });
  }
});

router.get("/books", async (req, res) => {
  try {
    const {
      id,
      id_notIn,
      author_notLike,
      title_notLike,
      genre_notLike,
      price_notLike,
      year_ne,
      author,
      genre,
      price,
      availability,
      year,
      rating_gte,
      rating_lte,
      language,
      sortField,
      sortOrder,
      patch_id,
      field,
      value,
    } = req.query;

    const filters = {};

    // Добавляем фильтры по параметрам
    if (author) filters.author = author;
    if (genre) filters.genre = genre;
    if (price) filters.price = parseFloat(price);
    if (availability) filters.availability = availability;
    if (year) filters.year = parseInt(year, 10);
    if (language) filters.language = language;

    if (rating_gte || rating_lte) {
      filters.rating = {};
      if (rating_gte) filters.rating[Op.gte] = parseFloat(rating_gte);
      if (rating_lte) filters.rating[Op.lte] = parseFloat(rating_lte);
    }

    // Логика для фильтрации по id_notIn
    if (id_notIn) {
      const ids = id_notIn.split(",").map((id) => parseInt(id, 10));
      if (ids.some((id) => isNaN(id))) {
        return res
          .status(400)
          .json({ error: "Invalid book ID(s) in 'id_notIn'" });
      }
      filters.id = { [Op.notIn]: ids };
    }

    // Логика для фильтрации по author_notLike
    if (author_notLike) {
      filters.author = { [Op.notLike]: `%${author_notLike.trim()}%` };
    }

    // Логика для фильтрации по title_notLike
    if (title_notLike) {
      filters.title = { [Op.notLike]: `%${title_notLike.trim()}%` };
    }

    // Логика для фильтрации по genre_notLike
    if (genre_notLike) {
      filters.genre = { [Op.notLike]: `%${genre_notLike.trim()}%` };
    }

    // Логика для фильтрации по price_notLike
    if (price_notLike) {
      filters.genre = { [Op.notLike]: `%${price_notLike.trim()}%` };
    }

    // Логика для фильтрации по year_ne
    if (year_ne) {
      filters.year = { [Op.ne]: parseInt(year_ne, 10) };
    }

    const order = [];
    if (sortField && sortOrder) {
      const validFields = ["title", "author", "price", "year", "rating"];
      const validOrders = ["asc", "desc"];

      if (validFields.includes(sortField) && validOrders.includes(sortOrder)) {
        order.push([sortField, sortOrder]);
      } else {
        return res.status(400).json({ error: "Invalid sort parameters" });
      }
    }

    // Получаем все книги
    const allBooks = await SomeBook.findAll({
      where: filters,
      order: order,
    });

    if (allBooks.length === 0) {
      return res.status(404).json({ error: "Книги не найдены" });
    }

    const updatedBooks = [];

    // Если переданы параметры виртуального patch
    if (patch_id && field && value !== undefined) {
      const ids = patch_id.split(",").map((id) => parseInt(id, 10));
      for (const book of allBooks) {
        const bookData = book.toJSON();
        if (ids.includes(bookData.id)) {
          bookData[field] =
            typeof bookData[field] === "number" ? Number(value) : value;
        }
        updatedBooks.push(bookData);
      }
      return res.json(updatedBooks);
    }

    res.json(allBooks);
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
