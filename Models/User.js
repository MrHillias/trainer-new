const { DataTypes } = require("sequelize");
const { sequelize } = require("../Utils/db_launch");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  confirmationToken: {
    type: DataTypes.UUID, // Должен быть UUID
    defaultValue: DataTypes.UUIDV4, // Генерирует случайный UUID
  },
});

module.exports = User;
