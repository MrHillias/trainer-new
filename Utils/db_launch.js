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
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD ? "HIDDEN" : "MISSING",
});

const tasksDB = new Sequelize(
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

async function initDB() {
  try {
    console.log("Попытка подключения к базе данных...");
    await sequelize.authenticate();
    console.log("База данных успешно подключена!");

    console.log("Синхронизация базы данных...");
    await sequelize.sync();
    console.log("Синхронизация завершена!");
  } catch (err) {
    console.error("Ошибка при работе с базой данных:", err);
    process.exit(1);
  }
}

// Вызываем `initDB()` один раз при старте
initDB();

module.exports = sequelize;
