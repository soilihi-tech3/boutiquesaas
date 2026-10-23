const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Achat = sequelize.define("Achat", {
  boutiqueId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  fournisseurId: { type: DataTypes.INTEGER, allowNull: true },
  quantite: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  prixAchatUnitaire: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  totalAchat: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  dateAchat: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: "achats" });

module.exports = Achat;
