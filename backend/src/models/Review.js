const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define("Review", {
  productId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  note: { type: DataTypes.TINYINT, allowNull: false },
  commentaire: { type: DataTypes.TEXT },
  statut: { type: DataTypes.ENUM("publie", "masque"), defaultValue: "publie" },
}, { tableName: "reviews", updatedAt: false });

module.exports = Review;
