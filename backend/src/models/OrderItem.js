const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define("OrderItem", {
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantite: { type: DataTypes.INTEGER, allowNull: false },
  prixUnitaire: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: "order_items", timestamps: false });

module.exports = OrderItem;
