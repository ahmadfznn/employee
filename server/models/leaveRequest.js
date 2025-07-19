"use strict";
const { Model } = require("sequelize");
const employee = require("./employee");
module.exports = (sequelize, DataTypes) => {
  class LeaveRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LeaveRequest.init(
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
      leave_type: {
        type: DataTypes.ENUM("annual", "sick", "unpaid", "maternity", "other"),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
      },
      approved_by: {
        type: DataTypes.UUID,
        references: {
          model: employee,
          key: "id",
        },
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LeaveRequest",
      tableName: "leave_requests",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return LeaveRequest;
};
