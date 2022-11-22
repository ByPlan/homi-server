"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Participant extends Model {
    static associate(models) {
      models.Participant.belongsToMany(models.Furniture, {
        through: "ParticipantFurnitures",
        as: "furnitures",
        foreignKey: "participantId",
      });
    }
  }
  Participant.init(
    {
      age: DataTypes.INTEGER,
      job: DataTypes.STRING,
      residenceType: DataTypes.STRING,
      style: DataTypes.JSON,
      wallpaper: DataTypes.STRING,
      budget: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Participant",
    }
  );
  return Participant;
};
