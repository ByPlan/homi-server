"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Furniture extends Model {
    static associate(models) {
      models.Furniture.belongsToMany(models.Participant, {
        through: "ParticipantFurnitures",
        as: "participants",
        foreignKey: "furnitureId",
      });
    }
  }
  Furniture.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      style: DataTypes.STRING,
      texture: DataTypes.STRING,
      price: DataTypes.STRING,
      imageLink: DataTypes.STRING,
      storeLink: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Furniture",
    }
  );
  return Furniture;
};
