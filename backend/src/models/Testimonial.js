const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Testimonial = sequelize.define(
  "Testimonial",
  {
    boutiqueId: { type: DataTypes.INTEGER, allowNull: false },
    nom: { type: DataTypes.STRING(150), allowNull: false },
    photoUrl: { type: DataTypes.TEXT("long"), allowNull: true },
    genre: { type: DataTypes.STRING(20), defaultValue: "femme" }, // 'femme' | 'homme' | 'tous'
    type: { type: DataTypes.STRING(30), defaultValue: "capture_whatsapp" }, // 'capture_whatsapp' | 'texte'
    message: { type: DataTypes.TEXT, allowNull: true },
    captureUrl: { type: DataTypes.TEXT("long"), allowNull: true },
    note: { type: DataTypes.TINYINT, defaultValue: 5 },
    actif: { type: DataTypes.BOOLEAN, defaultValue: true },
    ordre: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "testimonials",
    timestamps: true,
  }
);

module.exports = Testimonial;
