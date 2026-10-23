const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate, requireRole, requireOwnBoutique } = require("../middleware/auth");

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `img_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Seules les images sont acceptées."), false);
  }
});

router.post(
  "/upload",
  authenticate,
  requireRole("admin", "employe"),
  requireOwnBoutique,
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu." });
    try {
      const mimeType = req.file.mimetype || "image/jpeg";
      const fileBuffer = fs.readFileSync(req.file.path);
      const base64DataUrl = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
      res.json({ url: base64DataUrl });
    } catch (err) {
      const host = req.protocol + "://" + req.get("host");
      res.json({ url: `${host}/uploads/${req.file.filename}` });
    }
  }
);

module.exports = router;
