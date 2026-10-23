const fs = require("fs");
const path = require("path");

const templatesDir = path.join(__dirname, "../templates/emails");

/**
 * Lit un fichier template HTML et remplace les placeholders {{clé}} par leur valeur.
 * @param {string} templateName Nom du fichier (ex: 'otp.html')
 * @param {Record<string, any>} data Objet contenant les variables à remplacer
 * @returns {string} Le code HTML rendu
 */
function renderTemplate(templateName, data = {}) {
  const filePath = path.join(templatesDir, templateName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template e-mail introuvable: ${templateName}`);
  }
  let html = fs.readFileSync(filePath, "utf8");

  for (const [key, value] of Object.entries(data)) {
    const regExp = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    html = html.replace(regExp, value !== undefined && value !== null ? String(value) : "");
  }

  return html;
}

module.exports = { renderTemplate };
