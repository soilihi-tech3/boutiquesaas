# Documentation du Service E-mail & Brevo REST API (EasyMarket)

Cette documentation explique l'architecture du service e-mail transactionnel de l'application **EasyMarket**, les procédures de test et la gestion des quotas.

---

## 🏗️ Architecture du Service

Le service d'e-mail est intégralement géré dans le backend Node.js via le SDK officiel `@getbrevo/brevo` (API REST HTTP v3). **La clé API ne doit sous aucun prétexte être exposée au frontend ou commitée sur Git.**

### Fichiers Clés

- **`backend/src/services/emailService.js`** : Service principal gérant les envois via l'API REST Brevo (`sendTransacEmail`), le tracking des quotas quotidiens Redis et la traçabilité en BDD.
- **`backend/src/utils/templateEngine.js`** : Moteur de rendu HTML léger permettant de charger les templates et remplacer les variables `{{clé}}`.
- **`backend/src/templates/emails/`** :
  - `otp.html` : Code de vérification d'inscription à 6 chiffres (expire en 10 minutes).
  - `confirmation-commande.html` : Récapitulatif de commande (articles, prix, mode de livraison, boutique).
  - `changement-statut.html` : Notification de changement de statut de commande (Confirmée, En livraison, Livrée, etc.).
- **`backend/scripts/test-email.js`** : Script CLI de test rapide en environnement local ou staging.

---

## 🔐 Configuration des Variables d'Environnement

Dans `backend/.env` (et configuré sur Render / Railway en production) :

```env
BREVO_API_KEY=xkeysib-votre_cle_api_brevo_ici
BREVO_SENDER_EMAIL=contact@votredomaine.com
BREVO_SENDER_NAME=BoutiqueSaaS
```

> ⚠️ **Important** : L'adresse `BREVO_SENDER_EMAIL` doit être **vérifiée** dans votre compte Brevo (menu **Senders, domains, IPs**).

---

## ⚙️ Configuration DNS pour la Production (SPF, DKIM, DMARC)

Afin d'éviter que les e-mails (notamment les codes OTP) ne finissent dans les spams de vos utilisateurs en production, configurez les enregistrements DNS chez votre registrar de nom de domaine :

1. **SPF** :
   ```txt
   Type: TXT
   Nom: @
   Valeur: v=spf1 include:spf.brevo.com ~all
   ```
2. **DKIM** :
   Procurez-vous la clé DKIM générée sur votre tableau de bord Brevo (*Senders & IPs -> Domains*).
3. **DMARC** :
   ```txt
   Type: TXT
   Nom: _dmarc
   Valeur: v=DMARC1; p=none;
   ```

---

## 🛡️ Sécurité & Limitations (Rate Limiting & Anti-Bruteforce)

- **Inscriptions par IP** : Max **5 inscriptions par heure par IP** (via `express-rate-limit`).
- **Renvois d'OTP** : Max **3 renvois de code par heure** par utilisateur/email (géré dans Redis via key `otp_resend_count:<email>`).
- **Code OTP** : Stocké temporairement dans Redis avec une validité strict de **10 minutes** (`SETEX otp:<email> 600 <code>`).
- **Blocage OTP Anti-Bruteforce** : En cas de **5 tentatives OTP erronées**, le compte est temporairement bloqué pendant 15 minutes (`otp_attempts:<email>`).

---

## 📊 Suivi des Quotas & Monitoring

Le plan gratuit de Brevo offre **300 e-mails par jour**.
- Chaque envoi incrémente un compteur quotidien dans Redis (`emails_sent_today:YYYY-MM-DD`).
- **Alerte Préventive** : Un log d'avertissement est émis lorsque le compteur atteint **250/300 e-mails**.
- **Traçabilité DB** : Tous les envois (succès ou échecs) sont journalisés dans la table `emails_log` (`EmailLog.js`).

Pour consulter vos statistiques d'envoi en direct :
Consultez votre tableau de bord Brevo dans **Statistics** -> **Transactional**.

---

## 🧪 Procédure de Test en Local

Pour tester l'envoi d'e-mails directement depuis votre terminal :

```bash
cd backend
node scripts/test-email.js votre-email@example.com
```

Le script enverra :
1. Un code OTP de test.
2. Une confirmation de commande de test.
