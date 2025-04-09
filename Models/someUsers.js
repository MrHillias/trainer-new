const { DataTypes } = require("sequelize");
const { etalonDB } = require("../Utils/db_launch");

const someUsers = etalonDB.define("someUsers", {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Обязательно для заполнения
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false, // Обязательно для заполнения
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false, // Обязательно для заполнения
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false, // Обязательно для заполнения
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false, // Обязательно для заполнения
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: false, // Обязательно для заполнения
  },
  isMarried: {
    type: DataTypes.BOOLEAN,
    allowNull: false, // Обязательно для заполнения
    defaultValue: false, // Статус подтверждения по умолчанию - false
  },
  estimatedNetworth: {
    type: DataTypes.INTEGER,
    allowNull: false, // Обязательно для заполнения
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false, // Обязательно для заполнения
  },
});

module.exports = someUsers;
