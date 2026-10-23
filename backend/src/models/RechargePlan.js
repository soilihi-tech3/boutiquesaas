const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RechargePlan = sequelize.define("RechargePlan", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    eur: { type: DataTypes.FLOAT, allowNull: false },
    kmf: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: true },
    popular: { type: DataTypes.BOOLEAN, defaultValue: false },
    promo: { type: DataTypes.BOOLEAN, defaultValue: false },
    operator: { type: DataTypes.ENUM("telma", "hury"), allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 }
  });
  return RechargePlan;
};
