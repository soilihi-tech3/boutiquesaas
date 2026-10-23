export const COUNTRIES = [
  { code: "KM", name: "Comores", dialCode: "+269", flag: "🇰🇲" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "SN", name: "Sénégal", dialCode: "+221", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
  { code: "MG", name: "Madagascar", dialCode: "+261", flag: "🇲🇬" },
  { code: "YT", name: "Mayotte", dialCode: "+262", flag: "🇾🇹" },
  { code: "RE", name: "La Réunion", dialCode: "+262", flag: "🇷🇪" },
  { code: "MA", name: "Maroc", dialCode: "+212", flag: "🇲🇦" },
  { code: "DZ", name: "Algérie", dialCode: "+213", flag: "🇩🇿" },
  { code: "TN", name: "Tunisie", dialCode: "+216", flag: "🇹🇳" },
  { code: "CM", name: "Cameroun", dialCode: "+237", flag: "🇨🇲" },
  { code: "ML", name: "Mali", dialCode: "+223", flag: "🇲🇱" },
  { code: "GN", name: "Guinée", dialCode: "+224", flag: "🇬🇳" },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫" },
  { code: "NER", name: "Niger", dialCode: "+227", flag: "🇳🇪" },
  { code: "TG", name: "Togo", dialCode: "+228", flag: "🇹🇬" },
  { code: "BJ", name: "Bénin", dialCode: "+229", flag: "🇧🇯" },
  { code: "GA", name: "Gabon", dialCode: "+241", flag: "🇬🇦" },
  { code: "CG", name: "Congo (Brazzaville)", dialCode: "+242", flag: "🇨🇬" },
  { code: "CD", name: "Congo (RDC)", dialCode: "+243", flag: "🇨🇩" },
  { code: "BE", name: "Belgique", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Suisse", dialCode: "+41", flag: "🇨🇭" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "US", name: "États-Unis", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "Royaume-Uni", dialCode: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Allemagne", dialCode: "+49", flag: "🇩🇪" },
  { code: "ES", name: "Espagne", dialCode: "+34", flag: "🇪🇸" },
  { code: "IT", name: "Italie", dialCode: "+39", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "TR", name: "Turquie", dialCode: "+90", flag: "🇹🇷" },
  { code: "AE", name: "Émirats Arabes Unis", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Arabie Saoudite", dialCode: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { code: "MU", name: "Maurice", dialCode: "+230", flag: "🇲🇺" },
  { code: "SC", name: "Seychelles", dialCode: "+248", flag: "🇸🇨" },
  { code: "DJ", name: "Djibouti", dialCode: "+253", flag: "🇩🇯" },
  { code: "TD", name: "Tchad", dialCode: "+235", flag: "🇹🇩" },
  { code: "MR", name: "Mauritanie", dialCode: "+222", flag: "🇲🇷" },
  { code: "CF", name: "Centrafrique", dialCode: "+236", flag: "🇨🇫" },
  { code: "GW", name: "Guinée-Bissau", dialCode: "+245", flag: "🇬🇼" },
  { code: "ST", name: "São Tomé-et-Príncipe", dialCode: "+239", flag: "🇸🇹" },
  { code: "CV", name: "Cap-Vert", dialCode: "+238", flag: "🇨🇻" }
];

export function parsePhoneInput(input, defaultDial = "+269") {
  if (!input) return "";
  const cleaned = input.trim();
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  // Si commence par un zéro ou des chiffres directement, on lui colle le defaultDial
  const numOnly = cleaned.replace(/^0+/, "");
  return `${defaultDial}${numOnly}`;
}
