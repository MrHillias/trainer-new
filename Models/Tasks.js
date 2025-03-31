const { DataTypes } = require("sequelize");
const { tasksDB } = require("../Utils/db_launch");

const Task = tasksDB.define(
  "Task",
  {
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskDifficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taskDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Task;
