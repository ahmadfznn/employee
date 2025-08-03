"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmployeeAllowance extends Model {
    static associate(models) {
      EmployeeAllowance.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee",
      });
      EmployeeAllowance.belongsTo(models.Allowance, {
        foreignKey: "allowance_id",
        as: "allowance",
      });
    }
  }
  EmployeeAllowance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employee_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      allowance_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: true, min: 0 },
      },
      effective_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EmployeeAllowance",
      tableName: "employee_allowances",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmployeeAllowance;
};
