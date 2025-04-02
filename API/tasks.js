const express = require("express");
const { tasksDB } = require("../Utils/db_launch");
const { QueryTypes } = require("sequelize");
const router = express.Router();

/**
 * 1. Получение списка всех таблиц в базе данных задач
 */
router.get("/tables", async (req, res) => {
  try {
    // Получаем список таблиц
    const tables = await tasksDB.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public';",
      { type: QueryTypes.SELECT }
    );

    const tableNames = tables.map((table) => table.table_name);

    // Функция для получения количества записей в таблице
    const getTableCount = async (tableName) => {
      const result = await tasksDB.query(
        `SELECT COUNT(*) FROM "${tableName}";`,
        { type: QueryTypes.SELECT }
      );
      return result[0].count || 0;
    };

    // Объект для маппинга title и description (можно заменить на запрос к БД)
    const tableDescriptions = {
      rests: {
        title: "Rest интеграции",
        description: "Апишка",
      },
      messageBrockers: {
        title: "Брокеры сообщений",
        description: "Брокер",
      },
      demands: {
        title: "Виды требований",
        description: "Фудж",
      },
    };

    // Формируем JSON-ответ
    const response = await Promise.all(
      tableNames.map(async (tableName, index) => {
        const count = await getTableCount(tableName);
        return {
          id: index + 1,
          type: tableName,
          title: tableDescriptions[tableName]?.title || "Неизвестная таблица",
          description:
            tableDescriptions[tableName]?.description || "Описание отсутствует",
          exercises: count,
        };
      })
    );

    res.json(response);
  } catch (error) {
    console.error("Ошибка при получении списка таблиц:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

/**
 * 2. Получение данных из конкретной таблицы
 */
router.get("/table/:tableName", async (req, res) => {
  const { tableName } = req.params;

  try {
    const [data] = await tasksDB.query(`SELECT * FROM "${tableName}"`);

    res.json(data);
  } catch (error) {
    console.error(
      `Ошибка при получении данных из таблицы ${tableName}:`,
      error
    );
    res
      .status(500)
      .json({ error: `Не удалось получить данные из таблицы ${tableName}` });
  }
});

module.exports = router;
