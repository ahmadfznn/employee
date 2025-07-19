"use strict";
const { Model } = require("sequelize");
const employee = require("./employee");
module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    static associate(models) {
      Payroll.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee",
      });
    }
  }
  Payroll.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      employee_id: {
        type: DataTypes.UUID,
        references: {
          model: employee,
          key: "id",
        },
      },
      month: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      base_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      bonus: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      deductions: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "paid"),
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payroll",
      tableName: "payrolls",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Payroll;
};
