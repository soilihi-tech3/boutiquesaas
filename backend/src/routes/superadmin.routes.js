const express = require("express");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Boutique, User, Order } = require("../models");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate, requireRole("super_admin"));

const { clearCachePattern } = require("../config/cache");
const { broadcast } = require("../utils/broadcaster");

function purgeCache() {
  clearCachePattern("/api/store").catch(() => {});
}

// GET /api/superadmin/boutiques
router.get("/boutiques", async (req, res, next) => {
  try {
    const boutiques = await Boutique.findAll({ order: [["createdAt", "DESC"]] });
    const withStats = await Promise.all(boutiques.map(async (b) => {
      const orders = await Order.findAll({ where: { boutiqueId: b.id, statut: { [Op.ne]: "annulee" } } });
      const admins = await User.findAll({ 
        where: { boutiqueId: b.id, role: { [Op.in]: ["admin", "employe"] } },
        attributes: { exclude: ["motDePasseHash"] }
      });
      const ca = orders.reduce((s, o) => s + Number(o.total), 0);
      return { ...b.toJSON(), chiffreAffaires: ca, nbVentes: orders.length, admins };
    }));
    res.json(withStats);
  } catch (err) { next(err); }
});

// GET /api/superadmin/users -> Liste complète de tous les utilisateurs (admins, employés, clients) avec leur boutique
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["motDePasseHash"] },
      include: [{ model: Boutique, attributes: ["id", "nom", "slug"] }],
      order: [["createdAt", "DESC"]]
    });
    res.json(users.map(u => {
      const plain = u.toJSON();
      if (plain.Boutique) {
        plain.boutique = plain.Boutique;
        delete plain.Boutique;
      }
      return plain;
    }));
  } catch (err) { next(err); }
});

// POST /api/superadmin/users -> Créer un utilisateur (Super Admin, Admin, Employé, Client) avec génération de mot de passe et email
router.post("/users", async (req, res, next) => {
  try {
    const { nom, email, telephone, role, boutiqueId, motDePasse } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    const cleanPhone = telephone ? String(telephone).trim() : null;

    if (!nom || (!cleanEmail && !cleanPhone)) {
      return res.status(400).json({ message: "Le nom et au moins un email ou téléphone sont requis." });
    }

    const { Op } = require("sequelize");
    const whereCond = [];
    if (cleanEmail) whereCond.push({ email: cleanEmail });
    if (cleanPhone) whereCond.push({ telephone: cleanPhone });

    const existant = await User.findOne({ where: { [Op.or]: whereCond } });
    if (existant) return res.status(409).json({ message: "Un compte existe déjà avec cet email ou téléphone." });

    const targetRole = role || "super_admin";
    const rawPassword = motDePasse && motDePasse.trim() ? motDePasse.trim() : Math.random().toString(36).slice(-8) + "A1!";
    const motDePasseHash = await bcrypt.hash(rawPassword, 10);

    const newUser = await User.create({
      nom: nom.trim(),
      email: cleanEmail,
      telephone: cleanPhone,
      motDePasseHash,
      role: targetRole,
      boutiqueId: boutiqueId ? Number(boutiqueId) : null,
      statut: "actif",
      mustChangePassword: true,
      isEmailVerified: true
    });

    if (cleanEmail) {
      const { envoyerEmailCreationCompte } = require("../services/emailService");
      let storeName = "Plateforme EasyMarket (Super Admin)";
      if (boutiqueId) {
        const b = await Boutique.findByPk(boutiqueId);
        if (b) storeName = b.nom;
      }
      envoyerEmailCreationCompte(cleanEmail, newUser.nom, cleanEmail || cleanPhone, cleanPhone, rawPassword, targetRole, storeName).catch(() => {});
    }

    res.status(201).json({
      user: {
        id: newUser.id,
        nom: newUser.nom,
        email: newUser.email,
        telephone: newUser.telephone,
        role: newUser.role,
        boutiqueId: newUser.boutiqueId,
        statut: newUser.statut,
        generatedPassword: rawPassword,
        mustChangePassword: true
      }
    });
  } catch (err) { next(err); }
});

// PUT /api/superadmin/users/:id -> Modifier un utilisateur (nom, email, telephone, role, boutiqueId)
router.put("/users/:id", async (req, res, next) => {
  try {
    const userToUpdate = await User.findByPk(req.params.id);
    if (!userToUpdate) return res.status(404).json({ message: "Utilisateur introuvable." });
    
    const { nom, email, telephone, role, boutiqueId, motDePasse } = req.body;
    
    if (nom) userToUpdate.nom = nom;
    if (email) userToUpdate.email = email;
    if (telephone !== undefined) userToUpdate.telephone = telephone;
    if (role) userToUpdate.role = role;
    if (boutiqueId !== undefined) userToUpdate.boutiqueId = boutiqueId || null;
    if (motDePasse && motDePasse.trim()) {
      userToUpdate.motDePasseHash = await bcrypt.hash(motDePasse.trim(), 10);
    }
    
    await userToUpdate.save();
    res.json({ message: "Utilisateur mis à jour avec succès.", user: userToUpdate });
  } catch (err) { next(err); }
});

// PATCH /api/superadmin/users/:id/statut -> Suspendre / Réactiver un utilisateur
router.patch("/users/:id/statut", async (req, res, next) => {
  try {
    const targetUser = await User.findByPk(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "Utilisateur introuvable." });

    const newStatut = req.body.statut || (targetUser.statut === "actif" ? "suspendu" : "actif");
    targetUser.statut = newStatut;
    await targetUser.save();
    
    res.json({ message: `Compte ${newStatut === "actif" ? "réactivé" : "suspendu"} avec succès.`, statut: newStatut });
  } catch (err) { next(err); }
});

// DELETE /api/superadmin/users/:id -> Supprimer un utilisateur
router.delete("/users/:id", async (req, res, next) => {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte Super Admin." });
    }
    const targetUser = await User.findByPk(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "Utilisateur introuvable." });

    // Vérifier si l'utilisateur possède des opérations enregistrées
    const hasClientOrders = await Order.count({ where: { clientId: targetUser.id } });
    const hasAssignedOrders = await Order.count({ where: { employeAssigneId: targetUser.id } });

    if (hasClientOrders > 0 || hasAssignedOrders > 0) {
      return res.status(400).json({ 
        message: "Impossible de supprimer cet utilisateur car il possède déjà des opérations enregistrées. Vous devez plutôt le suspendre.",
        canSuspend: true
      });
    }

    await targetUser.destroy();
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) { next(err); }
});


// POST /api/superadmin/boutiques -> crée une boutique + son compte Admin
router.post("/boutiques", async (req, res, next) => {
  try {
    const { nomBoutique, slug, customDomain, formuleAbonnement, nomAdmin, emailAdmin, telephoneAdmin, motDePasseAdmin } = req.body;
    const existant = await Boutique.findOne({ where: { slug } });
    if (existant) return res.status(409).json({ message: "Ce slug de boutique est déjà utilisé." });

    const formattedDomain = customDomain ? customDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '') : null;
    if (formattedDomain) {
      const existantDomain = await Boutique.findOne({ where: { customDomain: formattedDomain } });
      if (existantDomain) return res.status(409).json({ message: "Ce domaine personnalisé est déjà utilisé par une autre boutique." });
    }

    const boutique = await Boutique.create({ nom: nomBoutique, slug, customDomain: formattedDomain || null, formuleAbonnement });
    
    const rawPassword = motDePasseAdmin && motDePasseAdmin.trim() ? motDePasseAdmin.trim() : Math.random().toString(36).slice(-8) + "A1!";
    const motDePasseHash = await bcrypt.hash(rawPassword, 10);
    
    const cleanEmail = emailAdmin ? String(emailAdmin).trim().toLowerCase() : null;
    const cleanPhone = telephoneAdmin ? String(telephoneAdmin).trim() : null;

    const admin = await User.create({
      nom: nomAdmin ? nomAdmin.trim() : "Administrateur",
      email: cleanEmail,
      telephone: cleanPhone,
      motDePasseHash,
      role: "admin",
      boutiqueId: boutique.id,
      statut: "actif",
      mustChangePassword: true,
      isEmailVerified: true
    });

    if (cleanEmail) {
      const { envoyerEmailCreationCompte } = require("../services/emailService");
      envoyerEmailCreationCompte(cleanEmail, admin.nom, cleanEmail || cleanPhone, cleanPhone, rawPassword, "admin", nomBoutique).catch(() => {});
    }

    purgeCache();
    broadcast("boutique_updated", { boutiqueId: boutique.id });
    res.status(201).json({ 
      boutique, 
      admin: { 
        id: admin.id, 
        nom: admin.nom, 
        email: admin.email, 
        telephone: admin.telephone,
        generatedPassword: rawPassword,
        mustChangePassword: true 
      } 
    });
  } catch (err) { next(err); }
});

// PATCH /api/superadmin/boutiques/:id/statut  (active <-> suspendue)
router.patch("/boutiques/:id/statut", async (req, res, next) => {
  try {
    const boutique = await Boutique.findByPk(req.params.id);
    if (!boutique) return res.status(404).json({ message: "Boutique introuvable." });
    await boutique.update({ statut: req.body.statut });
    purgeCache();
    broadcast("boutique_updated", { boutiqueId: boutique.id });
    res.json(boutique);
  } catch (err) { next(err); }
});

// PUT /api/superadmin/boutiques/:id -> Modifier nom boutique, slug, formule, et mot de passe admin
router.put("/boutiques/:id", async (req, res, next) => {
  try {
    const boutique = await Boutique.findByPk(req.params.id);
    if (!boutique) return res.status(404).json({ message: "Boutique introuvable." });
    
    const { nom, slug, customDomain, stripePublishableKey, stripeSecretKey, stripeAccountId, formuleAbonnement, motDePasseAdmin, modulesActifs } = req.body;
    
    if (nom) boutique.nom = nom;
    if (slug && slug !== boutique.slug) {
      const existant = await Boutique.findOne({ where: { slug, id: { [Op.ne]: boutique.id } } });
      if (existant) return res.status(409).json({ message: "Ce slug de boutique est déjà utilisé." });
      boutique.slug = slug;
    }

    if (customDomain !== undefined) {
      const formattedDomain = customDomain ? customDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '') : null;
      if (formattedDomain && formattedDomain !== boutique.customDomain) {
        const existantDomain = await Boutique.findOne({ where: { customDomain: formattedDomain, id: { [Op.ne]: boutique.id } } });
        if (existantDomain) return res.status(409).json({ message: "Ce domaine personnalisé est déjà utilisé par une autre boutique." });
      }
      boutique.customDomain = formattedDomain || null;
    }

    if (stripePublishableKey !== undefined) boutique.stripePublishableKey = stripePublishableKey;
    if (stripeSecretKey !== undefined) boutique.stripeSecretKey = stripeSecretKey;
    if (stripeAccountId !== undefined) boutique.stripeAccountId = stripeAccountId;

    if (formuleAbonnement) boutique.formuleAbonnement = formuleAbonnement;
    if (modulesActifs && typeof modulesActifs === "object") {
      let cleanModules = modulesActifs;
      if (typeof cleanModules === "string") {
        try { cleanModules = JSON.parse(cleanModules); } catch (e) {}
      }
      boutique.modulesActifs = cleanModules;
    }
    await boutique.save();

    // Mettre à jour le mot de passe admin si fourni
    if (motDePasseAdmin && motDePasseAdmin.trim()) {
      const adminUser = await User.findOne({ where: { boutiqueId: boutique.id, role: "admin" } });
      if (adminUser) {
        adminUser.motDePasseHash = await bcrypt.hash(motDePasseAdmin.trim(), 10);
        await adminUser.save();
      }
    }

    purgeCache();
    broadcast("boutique_updated", { boutiqueId: boutique.id });
    res.json({ message: "Boutique mise à jour avec succès", boutique });
  } catch (err) { next(err); }
});

// PUT /api/superadmin/boutiques/:id/modules -> Activer / Désactiver des modules pour une boutique spécifique
router.put("/boutiques/:id/modules", async (req, res, next) => {
  try {
    const boutique = await Boutique.findByPk(req.params.id);
    if (!boutique) return res.status(404).json({ message: "Boutique introuvable." });
    let { modulesActifs } = req.body;
    if (modulesActifs) {
      if (typeof modulesActifs === "string") {
        try { modulesActifs = JSON.parse(modulesActifs); } catch (e) {}
      }
      boutique.modulesActifs = modulesActifs;
      await boutique.save();
    }
    purgeCache();
    broadcast("boutique_updated", { boutiqueId: boutique.id });
    res.json({ message: "Modules de la boutique mis à jour avec succès", boutique });
  } catch (err) { next(err); }
});

// PUT /api/superadmin/modules/global -> Activer / Désactiver une fonctionnalité pour TOUTES les boutiques de l'application
router.put("/modules/global", async (req, res, next) => {
  try {
    const { moduleKey, active } = req.body;
    if (!moduleKey) return res.status(400).json({ message: "Clé de module requise." });

    const boutiques = await Boutique.findAll();
    for (const b of boutiques) {
      let current = b.modulesActifs || {};
      if (typeof current === "string") {
        try { current = JSON.parse(current); } catch (e) { current = {}; }
      }
      // Sanitisation en cas d'objet sérialisé de manière corrompue avec des clés d'index numérique
      if (typeof current === "object" && current !== null && current["0"] !== undefined) {
        current = {};
      }
      const updatedModules = { ...current, [moduleKey]: active };
      b.modulesActifs = updatedModules;
      await b.save();
    }

    purgeCache();
    broadcast("boutique_updated", { global: true });
    res.json({ message: `Le module "${moduleKey}" a été ${active ? "activé" : "désactivé"} pour TOUTES les boutiques.` });
  } catch (err) { next(err); }
});

// DELETE /api/superadmin/boutiques/:id -> Supprimer la boutique et ses utilisateurs
router.delete("/boutiques/:id", async (req, res, next) => {
  try {
    const boutique = await Boutique.findByPk(req.params.id);
    if (!boutique) return res.status(404).json({ message: "Boutique introuvable." });
    
    await User.destroy({ where: { boutiqueId: boutique.id } });
    await boutique.destroy();
    purgeCache();
    broadcast("boutique_updated", { boutiqueId: req.params.id });
    res.json({ message: "Boutique supprimée." });
  } catch (err) { next(err); }
});

// GET /api/superadmin/stats -> vue globale plateforme
router.get("/stats", async (req, res, next) => {
  try {
    const boutiques = await Boutique.findAll();
    const orders = await Order.findAll({ where: { statut: { [Op.ne]: "annulee" } } });
    const totalUsers = await User.count();
    const totalAdmins = await User.count({ where: { role: { [Op.in]: ["admin", "employe"] } } });
    const chiffreAffairesCumule = orders.reduce((s, o) => s + Number(o.total), 0);
    res.json({
      nbBoutiques: boutiques.length,
      nbBoutiquesActives: boutiques.filter((b) => b.statut === "active").length,
      chiffreAffairesCumule,
      nbVentesCumulees: orders.length,
      totalUsers,
      totalAdmins
    });
  } catch (err) { next(err); }
});

module.exports = router;
