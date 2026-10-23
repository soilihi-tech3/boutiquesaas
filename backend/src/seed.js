const bcrypt = require("bcryptjs");
const { Boutique, User, Category, Product, Order, OrderItem, Review, Marque, Testimonial, Famille } = require("./models");

/**
 * Insère les données de démonstration Cosmétique & Beauté dans boutiquesdb
 */
async function runSeed() {
  console.log("Initialisation des données Cosmétiques, Beauté, Peignes & Broches dans la base de données...");

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // --- 1. Super Admin plateforme ---
  await User.findOrCreate({
    where: { email: "superadmin@boutique-saas.com" },
    defaults: {
      nom: "Super Admin",
      email: "superadmin@boutique-saas.com",
      motDePasseHash: hash("SuperAdmin123!"),
      role: "super_admin",
    }
  });

  // --- 2. Bannières Slider Cosmétiques & Beauté ---
  const bannerSlides = [
    {
      id: 1,
      title: "Cosmétique, Soins & Beauté d'Exception",
      subtitle: "Sublimez votre éclat au quotidien avec nos sérums, crèmes et soins pour Femme & Homme.",
      imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=80",
      buttonText: "Découvrir la collection",
      linkUrl: "/catalogue"
    },
    {
      id: 2,
      title: "Broches Élégantes & Accessoires Tendance",
      subtitle: "Magnifiques broches raffinées, pinces perles et accessoires bijoux pour parfaire vos tenues.",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80",
      buttonText: "Voir les broches",
      linkUrl: "/catalogue?famille=Broches"
    },
    {
      id: 3,
      title: "Soins Cheveux, Peignes & Brosses Professionnels",
      subtitle: "Peignes en bois antistatiques, brosses naturelles et soins capillaires revitalisants.",
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80",
      buttonText: "Commander maintenant",
      linkUrl: "/catalogue?famille=Cheveux"
    }
  ];

  // --- 3. Boutique Cosmétique ---
  let boutique = await Boutique.findOne({ where: { slug: "electro-pro" } });
  if (!boutique) {
    boutique = await Boutique.create({
      nom: "Élégance & Cosmétiques",
      slug: "electro-pro",
      logoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80",
      couleurPrincipale: "#BE185D",
      devise: "KMF",
      formuleAbonnement: "commission",
      fraisLivraison: 1500,
      zonesLivraison: "Moroni, Mitsamiouli, Foumbouni, Grand Comore, Régions",
      bannerSlides: bannerSlides
    });
  } else {
    await boutique.update({
      nom: "Élégance & Cosmétiques",
      logoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80",
      couleurPrincipale: "#BE185D",
      bannerSlides: bannerSlides
    });
  }

  // --- 3.b Marques Cosmétiques Référencées ---
  const marquesData = [
    { nom: "The Ordinary", description: "Formules cliniques d'intégrité et soins visage ciblés." },
    { nom: "L'Oréal Paris", description: "Expert mondial de la beauté, des soins cheveux et maquillage." },
    { nom: "CeraVe", description: "Soins dermatologiques enrichis aux céramides essentiels." },
    { nom: "Yves Rocher", description: "Cosmétique végétale et parfumerie d'exception." },
    { nom: "Kérastase", description: "Soins capillaires de luxe professionnels." },
    { nom: "Dior Beauté", description: "Haute parfumerie et accessoires d'élégance." }
  ];

  const marquesMap = {};
  for (const m of marquesData) {
    const [mObj] = await Marque.findOrCreate({
      where: { nom: m.nom, boutiqueId: boutique.id },
      defaults: { ...m, boutiqueId: boutique.id }
    });
    marquesMap[m.nom] = mObj;
  }

  // --- 4. Comptes Administrateur, Employés & Client ---
  const usersToSeed = [
    { email: "superadmin@boutique-saas.com", nom: "Super Admin", role: "super_admin", pw: "SuperAdmin123!" },
    { email: "admin@electro-pro.com", nom: "Amina Said (Admin)", role: "admin", boutiqueId: boutique.id, pw: "Admin123!" },
    { email: "vendeur@electro-pro.com", nom: "Nassor Ali", role: "employe", boutiqueId: boutique.id, pw: "Employe123!", permissions: ["voir_dashboard", "gerer_commandes"] },
    { email: "client@example.com", nom: "Fatima Mohamed", role: "client", pw: "Client123!" },
  ];

  let emp2 = null;
  let clientUser = null;

  for (const u of usersToSeed) {
    let usr = await User.findOne({ where: { email: u.email } });
    if (!usr) {
      usr = await User.create({
        nom: u.nom,
        email: u.email,
        motDePasseHash: hash(u.pw),
        role: u.role,
        boutiqueId: u.boutiqueId || null,
        permissions: u.permissions || null
      });
    } else {
      usr.motDePasseHash = hash(u.pw);
      usr.role = u.role;
      if (u.boutiqueId) usr.boutiqueId = u.boutiqueId;
      if (u.permissions) usr.permissions = u.permissions;
      await usr.save();
    }
    if (u.email === "vendeur@electro-pro.com") emp2 = usr;
    if (u.email === "client@example.com") clientUser = usr;
  }

  // --- 5. Catégories & Familles Cosmétiques & Beauté ---
  const familleList = [
    { nom: "Cosmétique", boutiqueId: boutique.id },
    { nom: "Cheveux, Peignes & Brosses", boutiqueId: boutique.id },
    { nom: "Broches & Accessoires Bijoux", boutiqueId: boutique.id },
    { nom: "Parfums & Fragrances", boutiqueId: boutique.id },
    { nom: "Maquillage & Teint", boutiqueId: boutique.id }
  ];
  for (const fam of familleList) {
    await Famille.findOrCreate({
      where: { nom: fam.nom, boutiqueId: boutique.id },
      defaults: fam
    });
  }

  const catList = [
    { nom: "Soins Visage & Corps", famille: "Cosmétique", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80" },
    { nom: "Cheveux, Peignes & Brosses", famille: "Cheveux, Peignes & Brosses", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80" },
    { nom: "Broches & Accessoires Bijoux", famille: "Broches & Accessoires Bijoux", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80" },
    { nom: "Parfums & Fragrances", famille: "Parfums & Fragrances", imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80" },
    { nom: "Maquillage & Teint", famille: "Maquillage & Teint", imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80" },
  ];

  const cats = {};
  for (const c of catList) {
    const [catObj] = await Category.findOrCreate({
      where: { nom: c.nom, boutiqueId: boutique.id },
      defaults: { ...c, boutiqueId: boutique.id }
    });
    cats[c.nom] = catObj;
  }

  // --- 6. Produits Cosmétiques, Peignes, Broches (Homme, Femme, Mixte) ---
  const produitsData = [
    // --- FEMME ---
    {
      nom: "Sérum Niacinamide 10% + Zinc 1%",
      cat: "Soins Visage & Corps",
      marque: "The Ordinary",
      genre: "femme",
      prix: 6500,
      prixPromo: 5500,
      enPromo: true,
      unite: "flacon 30ml",
      stock: 35,
      seuilAlerte: 5,
      coutAchat: 3200,
      ventesCount: 48,
      isNouveau: true,
      description: "Formule ultra-légère pour réduire l'apparence des imperfections cutanées et réguler le sébum.",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
    },
    {
      nom: "Broche Bijou Fleur en Perles & Cristal Doré",
      cat: "Broches & Accessoires Bijoux",
      marque: "Dior Beauté",
      genre: "femme",
      prix: 8500,
      prixPromo: 7200,
      enPromo: true,
      unite: "pièce",
      stock: 25,
      seuilAlerte: 4,
      coutAchat: 4000,
      ventesCount: 30,
      isNouveau: true,
      description: "Sublime broche fleurie ornée de perles nacrées et cristaux étincelants pour sublimer foulards, voiles et robes.",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80"
    },
    {
      nom: "Eau de Parfum Fleurie Sublime 100ml",
      cat: "Parfums & Fragrances",
      marque: "Yves Rocher",
      genre: "femme",
      prix: 28000,
      prixPromo: 24500,
      unite: "flacon",
      stock: 18,
      seuilAlerte: 3,
      coutAchat: 16000,
      ventesCount: 19,
      isNouveau: false,
      description: "Fragrance florale envoûtante aux notes de jasmin, rose damascena et vanille gourmande.",
      imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
    },
    {
      nom: "Rouge à Lèvres Velours Mat Longue Tenue",
      cat: "Maquillage & Teint",
      marque: "L'Oréal Paris",
      genre: "femme",
      prix: 4500,
      unite: "tube",
      stock: 45,
      seuilAlerte: 10,
      coutAchat: 2200,
      ventesCount: 52,
      isNouveau: true,
      description: "Couleur intense et veloutée sans assécher les lèvres. Tenue garantie jusqu'à 16 heures.",
      imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80"
    },

    // --- HOMME ---
    {
      nom: "Coffret Soin Barbe & Visage Homme (Huile + Baume)",
      cat: "Soins Visage & Corps",
      marque: "L'Oréal Paris",
      genre: "homme",
      prix: 14500,
      prixPromo: 12900,
      enPromo: true,
      unite: "coffret",
      stock: 22,
      seuilAlerte: 5,
      coutAchat: 8500,
      ventesCount: 26,
      isNouveau: true,
      description: "Huile nourrissante à l'extrait de bois de cèdre et baume adoucissant pour une barbe soyeuse et une peau apaisée.",
      imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    },
    {
      nom: "Peigne à Barbe et Cheveux en Bois de Santal Double Denture",
      cat: "Cheveux, Peignes & Brosses",
      marque: "L'Oréal Paris",
      genre: "homme",
      prix: 3800,
      unite: "pièce",
      stock: 50,
      seuilAlerte: 10,
      coutAchat: 1800,
      ventesCount: 39,
      isNouveau: true,
      description: "Peigne sculpté dans du bois de santal naturel antistatique. Démêle en douceur et stimule la pousse.",
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80"
    },
    {
      nom: "Eau de Parfum Boisée Intense 100ml",
      cat: "Parfums & Fragrances",
      marque: "Dior Beauté",
      genre: "homme",
      prix: 35000,
      prixPromo: 31000,
      enPromo: true,
      unite: "flacon",
      stock: 14,
      seuilAlerte: 3,
      coutAchat: 22000,
      ventesCount: 17,
      isNouveau: false,
      description: "Signature olfactive virile et élégante aux accents de bergamote, poivre noir et vétiver fumé.",
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
    },

    // --- MIXTE ---
    {
      nom: "Grand Peigne Démêloir en Bois Naturel Anti-Casse",
      cat: "Cheveux, Peignes & Brosses",
      marque: "Kérastase",
      genre: "mixte",
      prix: 3500,
      unite: "pièce",
      stock: 60,
      seuilAlerte: 12,
      coutAchat: 1500,
      ventesCount: 64,
      isNouveau: true,
      description: "Peigne large à dents espacées pour démêler cheveux bouclés, crépus, lisses ou humides sans casser la fibre.",
      imageUrl: "https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    },
    {
      nom: "Crème Hydratante Visage & Corps aux 3 Céramides 454g",
      cat: "Soins Visage & Corps",
      marque: "CeraVe",
      genre: "mixte",
      prix: 12500,
      prixPromo: 10900,
      enPromo: true,
      unite: "pot 454g",
      stock: 30,
      seuilAlerte: 8,
      coutAchat: 7500,
      ventesCount: 58,
      isNouveau: true,
      description: "Hydratation continue 48h pour peaux sèches à très sèches, formule non grasse sans parfum adaptée à toute la famille.",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
    },
    {
      nom: "Huile Capillaire Élixir Ultime Sublimatrice 100ml",
      cat: "Cheveux, Peignes & Brosses",
      marque: "Kérastase",
      genre: "mixte",
      prix: 19500,
      unite: "flacon 100ml",
      stock: 20,
      seuilAlerte: 4,
      coutAchat: 13500,
      ventesCount: 23,
      isNouveau: false,
      description: "Élixir précieux d'huiles d'argan et de camélia pour une brillance éclatante et une protection anti-frisottis.",
      imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
      imageUrl2: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    }
  ];

  for (const p of produitsData) {
    const { cat, marque, ...rest } = p;
    const catObj = cats[cat];
    const marqueObj = marquesMap[marque];
    
    let prodObj = await Product.findOne({ where: { nom: p.nom, boutiqueId: boutique.id } });
    if (!prodObj) {
      await Product.create({
        ...rest,
        boutiqueId: boutique.id,
        categoryId: catObj ? catObj.id : null,
        marqueId: marqueObj ? marqueObj.id : null,
        famille: catObj ? catObj.nom : "Cosmétique"
      });
    } else {
      await prodObj.update({
        ...rest,
        genre: p.genre,
        categoryId: catObj ? catObj.id : prodObj.categoryId,
        marqueId: marqueObj ? marqueObj.id : prodObj.marqueId,
        famille: catObj ? catObj.nom : prodObj.famille
      });
    }
  }

  // --- 7. Témoignages & Avis Clients WhatsApp (Avec captures & photos de profil) ---
  const testimonialsData = [
    {
      nom: "Fatima Said",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      genre: "femme",
      type: "capture_whatsapp",
      message: "Salam ma sœur ! Colis bien reçu ce matin à Moroni. La broche fleur en perles est magnifique et le peigne en bois démêle tellement bien sans casser mes cheveux ! Merci pour la rapidité 🥰✨",
      captureUrl: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80",
      note: 5,
      actif: true,
      ordre: 1
    },
    {
      nom: "Nassor Bacar",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      genre: "homme",
      type: "capture_whatsapp",
      message: "Bien reçu mon frère ! L'huile à barbe et le peigne en bois de santal sentent super bon. Service sérieux et paiement Wave rapide. Je vais recommander chez vous sans hésiter 👍",
      captureUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
      note: 5,
      actif: true,
      ordre: 2
    },
    {
      nom: "Amina Mohamed",
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      genre: "femme",
      type: "texte",
      message: "Le sérum The Ordinary et la crème CeraVe sont 100% originaux ! Ma peau a retrouvé tout son éclat en seulement deux semaines. Équipe très gentille sur WhatsApp.",
      captureUrl: null,
      note: 5,
      actif: true,
      ordre: 3
    },
    {
      nom: "Ibrahim Ali",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      genre: "homme",
      type: "capture_whatsapp",
      message: "Bonjour, le parfum boisé est incroyable, excellente tenue toute la journée. Livraison respectée à domicile à l'heure convenue. Merci beaucoup.",
      captureUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      note: 5,
      actif: true,
      ordre: 4
    },
    {
      nom: "Zalika Youssouf",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      genre: "femme",
      type: "capture_whatsapp",
      message: "J'ai reçu ma commande de broches bijoux et de rouge à lèvres. Les finitions des broches sont splendides, exactement comme sur les photos. Merci pour le petit cadeau !",
      captureUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      note: 5,
      actif: true,
      ordre: 5
    }
  ];

  for (const t of testimonialsData) {
    const [testiObj] = await Testimonial.findOrCreate({
      where: { nom: t.nom, boutiqueId: boutique.id },
      defaults: { ...t, boutiqueId: boutique.id }
    });
    if (testiObj) {
      await testiObj.update({ ...t, boutiqueId: boutique.id });
    }
  }

  const { clearCachePattern } = require("./config/cache");
  await clearCachePattern("cache:/api/store").catch(() => {});

  console.log("Seed Cosmétiques & Beauté exécuté avec succès dans boutiquesdb !");
}

module.exports = runSeed;

if (require.main === module) {
  const sequelize = require("./config/database");
  sequelize.sync({ alter: true }).then(runSeed).then(() => process.exit(0)).catch(err => {
    console.error("Erreur de seed:", err);
    process.exit(1);
  });
}
