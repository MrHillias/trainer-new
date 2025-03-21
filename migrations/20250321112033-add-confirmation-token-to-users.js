"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "confirmationToken", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal("uuid_generate_v4()"), // Генерация UUID
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "confirmationToken");
  },
};
