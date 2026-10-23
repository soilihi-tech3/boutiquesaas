const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define("Notification", {
  userId: { type: DataTypes.INTEGER, allowNull: true },
  boutiqueId: { type: DataTypes.INTEGER, allowNull: true },
  title: { type: DataTypes.STRING(150), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING(50), defaultValue: "order" },
  orderId: { type: DataTypes.INTEGER, allowNull: true },
  lu: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: "notifications" });

module.exports = Notification;
