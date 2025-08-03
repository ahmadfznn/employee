"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CompanySettings extends Model {
    static associate(models) {
      // Tidak ada asosiasi karena ini adalah tabel single-row
    }
  }
  CompanySettings.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      standard_work_hours_per_day: {
        type: DataTypes.INTEGER,
        defaultValue: 8,
        validate: { min: 1, max: 24 },
      },
      standard_work_days_per_week: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: { min: 1, max: 7 },
      },
      start_work_time: {
        type: DataTypes.TIME,
        defaultValue: "09:00:00",
      },
      end_work_time: {
        type: DataTypes.TIME,
        defaultValue: "17:00:00",
      },
      overtime_rate_multiplier: {
        type: DataTypes.FLOAT,
        defaultValue: 1.5,
      },
    },
    {
      sequelize,
      modelName: "CompanySettings",
      tableName: "company_settings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return CompanySettings;
};
