const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmailLog = sequelize.define("EmailLog", {
  email: { type: DataTypes.STRING(255), allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false }, // 'otp', 'confirmation_commande', 'statut_commande', 'test'
  statut: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "succes" }, // 'succes', 'echec'
  error_message: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: "emails_log" });

module.exports = EmailLog;
