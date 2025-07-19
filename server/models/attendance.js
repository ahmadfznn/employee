"use strict";
const { Model } = require("sequelize");
const employee = require("./employee");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee",
      });
    }
  }
  Attendance.init(
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      check_in: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      check_out: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      location_check_in: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      location_check_out: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("present", "absent", "late", "leave"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Attendance",
      tableName: "attendances",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Attendance;
};
