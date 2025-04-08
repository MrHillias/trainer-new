const { DataTypes } = require("sequelize");
const { etalonDB } = require("../Utils/db_launch");

const someFlights = etalonDB.define("someFlights", {
  flightNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  airline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departureTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  arrivalTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  departureAirport: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arrivalAirport: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = someFlights;
