const { Sequelize } = require("sequelize");
require("dotenv").config({
  path: __dirname + `/../env/.env.${process.env.NODE_ENV}`,
});

console.log("DB Config:", {
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "HIDDEN" : "MISSING",
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      connectTimeout: 10000, // Тайм-аут подключения (10 сек)
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
    console.log("🔄 Попытка подключения к базе данных...");
    await sequelize.authenticate();
    console.log("✅ База данных успешно подключена!");

    console.log("🔄 Синхронизация базы данных...");
    await sequelize.sync();
    console.log("✅ Синхронизация завершена!");
  } catch (err) {
    console.error("❌ Ошибка при работе с базой данных:", err);
    process.exit(1); // Завершаем процесс при ошибке
  }
}

initDB();

module.exports = sequelize;
