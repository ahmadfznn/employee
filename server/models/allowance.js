"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Allowance extends Model {
    static associate(models) {
      Allowance.hasMany(models.EmployeeAllowance, {
        foreignKey: "allowance_id",
        as: "employee_allowances",
      });
    }
  }
  Allowance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      default_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { isInt: true, min: 0 },
      },
      is_fixed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Allowance",
      tableName: "allowances",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Allowance;
};
