"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Holiday extends Model {
    static associate(models) {
      // Tidak ada asosiasi
    }
  }
  Holiday.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: true },
      },
      is_national_holiday: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Holiday",
      tableName: "holidays",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Holiday;
};
