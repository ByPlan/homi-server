"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      models.Role.belongsToMany(models.User, {
        through: "UserRoles",
        as: "users",
        foreignKey: "roleId",
      });
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
