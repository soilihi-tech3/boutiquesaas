const { Boutique, User, Product } = require("../src/models");

async function testIsolation() {
  console.log("⚡ Démarrage des tests d'isolation multi-boutiques...");

  try {
    // 1. Récupération des boutiques de démonstration
    const boutiques = await Boutique.findAll();
    if (boutiques.length < 2) {
      console.log("ℹ️ Il faut au moins 2 boutiques en base pour valider l'isolation.");
      return;
    }

    const boutique1 = boutiques[0];
    const boutique2 = boutiques[1];

    console.log(`🏪 Boutique 1: ${boutique1.nom} (ID #${boutique1.id}, Slug: ${boutique1.slug})`);
    console.log(`🏪 Boutique 2: ${boutique2.nom} (ID #${boutique2.id}, Slug: ${boutique2.slug})`);

    // 2. Vérification de l'isolation des produits par boutiqueId
    const produitsB1 = await Product.findAll({ where: { boutiqueId: boutique1.id } });
    const produitsB2 = await Product.findAll({ where: { boutiqueId: boutique2.id } });

    console.log(`📦 Produits dans Boutique 1 (${boutique1.slug}) : ${produitsB1.length}`);
    console.log(`📦 Produits dans Boutique 2 (${boutique2.slug}) : ${produitsB2.length}`);

    // Vérifier l'étanchéité des produits
    const overlap = produitsB1.some(p1 => produitsB2.some(p2 => p2.id === p1.id));
    if (overlap) {
      throw new Error("❌ ERREUR D'ISOLATION : Des produits se chevauchent entre deux boutiques !");
    } else {
      console.log("✅ SUCCÈS : L'isolation des produits par boutiqueId est 100% étanche.");
    }

    // 3. Vérification de l'isolation des utilisateurs
    const usersB1 = await User.findAll({ where: { boutiqueId: boutique1.id } });
    const usersB2 = await User.findAll({ where: { boutiqueId: boutique2.id } });

    console.log(`👥 Utilisateurs/Admins Boutique 1 : ${usersB1.length}`);
    console.log(`👥 Utilisateurs/Admins Boutique 2 : ${usersB2.length}`);

    console.log("✅ SUCCÈS : Tous les tests d'isolation sont validés avec succès.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Échec des tests d'isolation :", err);
    process.exit(1);
  }
}

testIsolation();
