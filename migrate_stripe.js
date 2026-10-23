const sequelize = require("./backend/src/config/database");

async function run() {
  const queryInterface = sequelize.getQueryInterface();
  const tableBoutiques = await queryInterface.describeTable("boutiques");
  const columnsToAddBoutique = [
    { name: "stripe_publishable_key", type: "VARCHAR(255) NULL" },
    { name: "stripe_secret_key", type: "VARCHAR(255) NULL" },
    { name: "stripe_account_id", type: "VARCHAR(255) NULL" },
    { name: "stripe_onboarding_complete", type: "TINYINT(1) DEFAULT 0" }
  ];

  for (const col of columnsToAddBoutique) {
    if (!tableBoutiques[col.name]) {
      console.log("[MIGRATION] Ajout colonne manquante sur boutiques:", col.name);
      await sequelize.query(`ALTER TABLE boutiques ADD COLUMN ${col.name} ${col.type};`);
    } else {
      console.log(`[MIGRATION] ${col.name} existe déjà.`);
    }
  }
  process.exit(0);
}
run();
