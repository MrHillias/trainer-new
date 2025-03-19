const { DataTypes } = require("sequelize");
const sequelize = require("../Utils/db_launch"); // Импортируем настроенное соединение с БД

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // По умолчанию пользователь не подтвержден
    },
  },
  {
    tableName: "Users",
  }
);

module.exports = User;
