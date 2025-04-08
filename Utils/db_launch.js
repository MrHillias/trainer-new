const { Sequelize } = require("sequelize");
require("dotenv").config({
  path: __dirname + `/../env/.env.${process.env.NODE_ENV}`,
});

console.log("DB Config:", {
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD ? "HIDDEN" : "MISSING",
});

// Подключение к основной базе данных
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      connectTimeout: 10000, // 10 секунд тайм-аут
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Подключение ко второй базе данных (tasksDB)
require("dotenv").config({
  path: __dirname + `/../env/.env.tasks`,
});

console.log("Tasks DB Config:", {
  host: process.env.TASKS_DB_HOST,
  name: process.env.TASKS_DB_NAME,
  user: process.env.TASKS_DB_USER,
  port: process.env.TASKS_DB_PORT,
  password: process.env.TASKS_DB_PASSWORD ? "HIDDEN" : "MISSING",
});

const tasksDB = new Sequelize(
  process.env.TASKS_DB_NAME,
  process.env.TASKS_DB_USER,
  process.env.TASKS_DB_PASSWORD,
  {
    host: process.env.TASKS_DB_HOST,
    port: process.env.TASKS_DB_PORT,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      connectTimeout: 10000, // 10 секунд тайм-аут
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Подключение к третьей базе данных (etalonDB)
require("dotenv").config({
  path: __dirname + `/../env/.env.etalon`,
});

console.log("Tasks DB Etalon:", {
  host: process.env.ETALON_DB_HOST, // Параметры для базы данных эталонов
  name: process.env.ETALON_DB_NAME,
  user: process.env.ETALON_DB_USER,
  port: process.env.ETALON_DB_PORT,
  password: process.env.ETALON_DB_PASSWORD ? "HIDDEN" : "MISSING",
});

const etalonDB = new Sequelize(
  process.env.ETALON_DB_NAME, // Использование переменных из .env.etalon
  process.env.ETALON_DB_USER,
  process.env.ETALON_DB_PASSWORD,
  {
    host: process.env.ETALON_DB_HOST,
    port: process.env.ETALON_DB_PORT,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      connectTimeout: 10000, // 10 секунд тайм-аут
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

async function initDB() {
  try {
    console.log("Попытка подключения к базе данных...");
    await sequelize.authenticate();
    console.log("Основная база данных успешно подключена!");

    console.log("Синхронизация основной базы данных...");
    await sequelize.sync();
    console.log("Синхронизация основной базы данных завершена!");

    console.log("Попытка подключения ко второй базе данных...");
    await tasksDB.authenticate();
    console.log("База данных задач успешно подключена!");

    console.log("Синхронизация базы данных задач...");
    await tasksDB.sync();
    console.log("Синхронизация базы данных задач завершена!");

    console.log("Попытка подключения к третьей базе данных...");
    await etalonDB.authenticate();
    console.log("База данных эталонов успешно подключена!");

    console.log("Синхронизация базы данных эталонов...");
    await etalonDB.sync();
    console.log("Синхронизация базы данных эталонов завершена!");
  } catch (err) {
    console.error("Ошибка при работе с базой данных:", err);
    process.exit(1);
  }
}

// Вызываем `initDB()` один раз при старте
initDB();

// Экспортируем оба подключения
module.exports = { sequelize, tasksDB, etalonDB };
