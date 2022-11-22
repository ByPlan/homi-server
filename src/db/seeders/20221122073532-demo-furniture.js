"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    "Furnitures",
      [
        {
          id: 1,
          name: "아이비 원목 침대 프레임",
          type: "침대",
          style: "내추럴",
          texture: "중간 우드톤",
          price: "179,900원",
          imageLink:
            "https://image.ohou.se/i/bucketplace-v2-development/uploads/productions/166693709798400117.png?gif=1&w=1280&h=1280&c=c&webp=1",
          storeLink:
            "https://ohou.se/productions/114627/selling?affect_type=ProductCategoryIndex&affect_id=",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {};
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Furnitures", null, {});
  },
};
