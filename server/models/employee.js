"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.hasMany(models.Attendance, {
        foreignKey: "employee_id",
        as: "attendances",
      });

      Employee.hasMany(models.Payroll, {
        foreignKey: "employee_id",
        as: "payrolls",
      });
    }

    static async hashPassword(password) {
      return await bcrypt.hash(password, 10);
    }

    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }
  Employee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      position: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "manager", "employee"),
        defaultValue: "employee",
      },
      department: {
        type: DataTypes.STRING(50),
        defaultValue: "IT",
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      photo_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "employees",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: async (employee) => {
          employee.password = await Employee.hashPassword(employee.password);
        },
      },
    }
  );
  return Employee;
};
