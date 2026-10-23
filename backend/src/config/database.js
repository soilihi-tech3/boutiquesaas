require("dotenv").config();
const { Sequelize } = require("sequelize");

const isSSL = process.env.DB_SSL === "true" || (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud.com"));

const sequelize = new Sequelize(
  process.env.DB_NAME ?? "boutique_saas",
  process.env.DB_USER ?? "boutique_user",
  process.env.DB_PASSWORD ?? "boutique_pass",
  {
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ?? 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: isSSL
      ? {
          ssl: {
            minVersion: "TLSv1.2",
            rejectUnauthorized: false,
          },
        }
      : {},
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

module.exports = sequelize;

