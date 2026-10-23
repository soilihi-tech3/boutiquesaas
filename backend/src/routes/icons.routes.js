const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");
const { Boutique } = require("../models");
const { remember } = require("../config/cache");

const CACHE_DIR = path.join(__dirname, "..", "..", "cache", "icons");

router.get("/icons/icon-:size.png", async (req, res) => {
  const size = parseInt(req.params.size, 10);
  if (![192, 512].includes(size)) return res.status(400).end();

  try {
    const slug = req.boutiqueSlug || req.query.slug || "biachara";
    const cachePath = path.join(CACHE_DIR, `${slug}-${size}.png`);

    // Check disk cache first
    try {
      await fs.access(cachePath);
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.sendFile(cachePath);
    } catch (e) {}

    // Find boutique logo
    const boutique = await remember(`boutique:${slug}`, 600, async () => {
      return await Boutique.findOne({ where: { slug } });
    });

    let sourceBuffer = null;

    if (boutique && boutique.logoUrl && boutique.logoUrl.startsWith("data:image")) {
      // Base64 logo
      const base64Data = boutique.logoUrl.split(";base64,").pop();
      sourceBuffer = Buffer.from(base64Data, "base64");
    } else if (boutique && boutique.logoUrl && boutique.logoUrl.startsWith("http")) {
      // URL logo
      sourceBuffer = boutique.logoUrl;
    }

    await fs.mkdir(CACHE_DIR, { recursive: true });

    let processSharp;
    if (sourceBuffer) {
      processSharp = sharp(sourceBuffer);
    } else {
      processSharp = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 22, g: 52, b: 36, alpha: 1 }
        }
      });
    }

    await processSharp
      .resize(size, size, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toFile(cachePath);

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(cachePath);
  } catch (err) {
    console.error("Icon generation error:", err);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    try {
      const fallbackPng = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 22, g: 52, b: 36, alpha: 1 }
        }
      }).png().toBuffer();
      res.send(fallbackPng);
    } catch (e) {
      res.status(500).end();
    }
  }
});

module.exports = router;
