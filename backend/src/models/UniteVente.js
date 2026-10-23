const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UniteVente = sequelize.define("UniteVente", {
  boutiqueId: { type: DataTypes.INTEGER, allowNull: false },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  abbreviation: { type: DataTypes.STRING(20), allowNull: true },
}, { tableName: "unites_vente" });

module.exports = UniteVente;
