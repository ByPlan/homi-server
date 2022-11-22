"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UserRoles",
      [
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: 1,
          userId: 1,
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: 2,
          userId: 1,
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: 3,
          userId: 1,
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: 1,
          userId: 2,
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: 2,
          userId: 2,
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: 3,
          userId: 2,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserRoles", null, {});
  },
};
