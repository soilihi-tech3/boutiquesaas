require("dotenv").config({ path: __dirname + "/../.env" });
const { envoyerOTP, envoyerConfirmationCommande } = require("../src/services/emailService");

async function runTest() {
  const targetEmail = process.argv[2] || process.env.BREVO_SENDER_EMAIL || "soilihiabdou99@gmail.com";
  console.log("=================================================");
  console.log("🧪 TEST D'ENVOI D'E-MAIL BREVO (REST API v3)");
  console.log("=================================================");
  console.log(`Clé Brevo configurée : ${process.env.BREVO_API_KEY ? '✅ OUI (' + process.env.BREVO_API_KEY.substring(0, 12) + '...)' : '❌ NON'}`);
  console.log(`Expéditeur           : ${process.env.BREVO_SENDER_NAME || 'EasyMarket'} <${process.env.BREVO_SENDER_EMAIL || 'non défini'}>`);
  console.log(`Destinataire Test    : ${targetEmail}`);
  console.log("-------------------------------------------------");

  console.log("🚀 Envoi du code OTP de test (123456)...");
  const resultOtp = await envoyerOTP(targetEmail, "123456", "Utilisateur Test");

  if (resultOtp) {
    console.log("✅ E-mail OTP envoyé avec succès ! Vérifiez la boîte de réception.");
  } else {
    console.error("❌ Échec de l'envoi de l'e-mail OTP. Consultez les logs ci-dessus.");
  }

  console.log("\n🚀 Envoi d'une confirmation de commande de test...");
  const dummyOrder = {
    id: 999,
    total: 45.50,
    modeLivraison: "domicile",
    moyenPaiement: "Carte bancaire",
    client: { nom: "Utilisateur Test" },
    items: [
      { product: { nom: "Panier de Légumes Bio" }, quantite: 1, prixUnitaire: 25.50 },
      { product: { nom: "Jus de Mangue Artisanal" }, quantite: 2, prixUnitaire: 10.00 }
    ]
  };

  const resultCmd = await envoyerConfirmationCommande(targetEmail, dummyOrder, "EasyMarket Test");

  if (resultCmd) {
    console.log("✅ E-mail de confirmation de commande envoyé avec succès !");
  } else {
    console.error("❌ Échec de l'envoi de l'e-mail de confirmation de commande.");
  }

  console.log("=================================================\n");
  process.exit(resultOtp || resultCmd ? 0 : 1);
}

runTest();
