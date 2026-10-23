const { Boutique } = require('../models');
const { Op } = require('sequelize');

const MAIN_DOMAINS = ['easymarket.com', 'www.easymarket.com', 'localhost', '127.0.0.1', 'onrender.com'];

/**
 * Middleware de résolution de boutique multi-tenant (Custom Domain, Subdomain, Header, or Fallback)
 */
async function resolveBoutique(req, res, next) {
  try {
    const customHeaderDomain = req.headers['x-boutique-domain'] 
      ? req.headers['x-boutique-domain'].split(':')[0].toLowerCase().trim()
      : null;

    const rawHost = req.headers['x-forwarded-host'] || req.hostname || 'localhost';
    const hostname = rawHost.split(':')[0].toLowerCase().trim();

    req.boutiqueSlug = req.headers['x-boutique-slug'] || req.headers['x-slug'] || req.query.slug || null;
    req.boutique = null;
    req.isCustomDomainResolved = false;

    // Collect candidates (custom header domain first, hostname second)
    const rawCandidates = [customHeaderDomain, hostname].filter(Boolean);

    // Keep candidates that are NOT internal API platform domains (like onrender.com, localhost)
    const externalDomains = rawCandidates.filter(d => 
      !MAIN_DOMAINS.some(m => d.includes(m))
    );

    // Clean domains (remove http://, https://, www., trailing slashes)
    const cleanedDomains = Array.from(new Set(
      externalDomains.flatMap(d => {
        const clean = d.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '').toLowerCase();
        return [clean, `www.${clean}`, `http://${clean}`, `https://${clean}`, `http://www.${clean}`, `https://www.${clean}`];
      })
    ));

    let boutique = null;

    // 1. Recherche prioritaire par Domaine Personnalisé (ex: comoresbiachara.site)
    if (cleanedDomains.length > 0) {
      boutique = await Boutique.findOne({
        where: {
          [Op.or]: [
            { customDomain: { [Op.in]: cleanedDomains } },
            ...cleanedDomains.map(d => ({ customDomain: { [Op.like]: `%${d}%` } }))
          ]
        }
      });
      if (boutique) {
        req.isCustomDomainResolved = true;
      }
    }

    // 2. Sinon, rechercher par slug (si un slug est spécifié dans l'en-tête ou le domaine)
    if (!boutique) {
      const potentialSlugs = [];
      if (req.boutiqueSlug && req.boutiqueSlug !== "marche-vert") potentialSlugs.push(req.boutiqueSlug);

      for (const d of cleanedDomains) {
        const firstPart = d.split('.')[0];
        if (firstPart && !['www', 'app', 'api', 'admin', 'localhost', '127'].includes(firstPart)) {
          potentialSlugs.push(firstPart);
        }
      }

      if (potentialSlugs.length > 0) {
        boutique = await Boutique.findOne({
          where: {
            slug: { [Op.in]: potentialSlugs }
          }
        });
      }
    }

    // 3. Fallback sur la première boutique active par défaut si aucune résolution spécifique
    if (!boutique) {
      boutique = await Boutique.findOne({ where: { statut: 'active' }, order: [['id', 'ASC']] });
    }

    if (!boutique) {
      boutique = await Boutique.findOne({ order: [['id', 'ASC']] });
    }

    if (boutique) {
      req.boutique = boutique;
      req.boutiqueSlug = boutique.slug;
      res.locals.boutique = boutique;
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = resolveBoutique;
