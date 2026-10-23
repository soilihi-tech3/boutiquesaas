const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fournisseur = sequelize.define("Fournisseur", {
  boutiqueId: { type: DataTypes.INTEGER, allowNull: false },
  nom: { type: DataTypes.STRING(150), allowNull: false },
  telephone: { type: DataTypes.STRING(30), allowNull: true },
  email: { type: DataTypes.STRING(150), allowNull: true },
  adresse: { type: DataTypes.STRING(255), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: "fournisseurs" });

module.exports = Fournisseur;
