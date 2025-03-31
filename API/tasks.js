const express = require("express");
const { tasksDB } = require("../Utils/db_launch");

const router = express.Router();

/**
 * 1. Получение списка всех таблиц в базе данных задач
 */
router.get("/tables", async (req, res) => {
  try {
    const tables = await tasksDB.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public';",
      { type: QueryTypes.SELECT }
    );
    console.log("Tables:", tables);

    // Возвращаем таблицы в ответе
    res.json({ tables });
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

    res.json({ table: tableName, data });
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
