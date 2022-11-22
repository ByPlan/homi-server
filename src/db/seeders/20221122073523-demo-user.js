"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 1,
          email: "heonsub6558@gmail.com",
          password: "",
          name: "노현섭",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: "daehan1028@gmail.com",
          password: "",
          name: "이대한",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
