import React, { useState } from "react";
import { X, Store, UserCheck, KeyRound, Eye, EyeOff, RefreshCw, Copy, CheckCircle, Key } from "lucide-react";

export default function CreateBoutiqueModal({ form, setForm, onSubmit, onClose }) {
  const [showPassword, setShowPassword] = useState(true);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!form) return null;

  function generateRandomPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, motDePasseAdmin: pwd });
    setShowPassword(true);
  }

  async function handleInternalSubmit() {
    const res = await onSubmit();
    if (res && res.admin) {
      setCreatedCredentials({
        nomBoutique: res.boutique?.nom || form.nomBoutique,
        nom: res.admin.nom || form.nomAdmin,
        email: res.admin.email || form.emailAdmin,
        telephone: res.admin.telephone || form.telephoneAdmin,
        identifiant: res.admin.email || res.admin.telephone || form.emailAdmin || form.telephoneAdmin,
        motDePasse: res.admin.generatedPassword || form.motDePasseAdmin || "changeme123"
      });
    }
  }

  function copyCredentialsToClipboard() {
    if (!createdCredentials) return;
    const textToCopy = `Compte Admin créé pour la boutique ${createdCredentials.nomBoutique} !\nNom: ${createdCredentials.nom}\nEmail: ${createdCredentials.email || 'N/A'}\nTéléphone: ${createdCredentials.telephone || 'N/A'}\nMot de passe temporaire: ${createdCredentials.motDePasse}\n\nNote: Le mot de passe devra être changé lors de la première connexion.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  if (createdCredentials) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)", padding: 32, textAlign: "center"
        }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EBF7F0", color: "#1F4D3A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle size={32} />
          </div>

          <h2 style={{ margin: "0 0 8px", fontSize: 20, color: "var(--forest-dark)" }}>Boutique & Admin créés avec succès !</h2>
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "0 0 20px" }}>
            Un e-mail d'accueil avec ces identifiants a été envoyé à l'administrateur.
          </p>

          <div style={{ background: "var(--paper)", padding: 20, borderRadius: 14, border: "1px solid var(--line)", textAlign: "left", marginBottom: 20 }}>
            <div style={{ fontSize: 13, marginBottom: 8, color: "var(--ink)" }}>
              <strong>Nom de la boutique :</strong> {createdCredentials.nomBoutique}
            </div>
            <div style={{ fontSize: 13, marginBottom: 8, color: "var(--ink)" }}>
              <strong>Admin :</strong> {createdCredentials.nom}
            </div>
            <div style={{ fontSize: 13, marginBottom: 8, color: "var(--ink)" }}>
              <strong>Email :</strong> <span style={{ fontFamily: "monospace", color: "var(--forest-dark)", fontWeight: 700 }}>{createdCredentials.email || "Non renseigné"}</span>
            </div>
            <div style={{ fontSize: 13, marginBottom: 8, color: "var(--ink)" }}>
              <strong>Téléphone :</strong> <span style={{ fontFamily: "monospace", color: "var(--forest-dark)", fontWeight: 700 }}>{createdCredentials.telephone || "Non renseigné"}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink)" }}>
              <strong>Mot de passe générique :</strong> <span style={{ fontFamily: "monospace", color: "#163424", fontWeight: 800, background: "#E2E8F0", padding: "2px 8px", borderRadius: 6 }}>{createdCredentials.motDePasse}</span>
            </div>
          </div>

          <div style={{ fontSize: 12.5, color: "#D97706", background: "#FEF3C7", padding: "10px 14px", borderRadius: 10, marginBottom: 20, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
            <Key size={16} /> À la 1ère connexion, cet admin devra obligatoirement modifier son mot de passe.
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={copyCredentialsToClipboard}
              style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "1px solid var(--forest)",
                background: copied ? "var(--forest)" : "#fff", color: copied ? "#fff" : "var(--forest)",
                fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copied ? "Copié !" : "Copier les identifiants"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bs-btn-primary"
              style={{ flex: 1, borderRadius: 12 }}
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 540,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column"
      }}>
        {/* HEADER */}
        <div style={{
          padding: "20px 24px", background: "var(--forest-dark)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Store size={20} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Créer une Nouvelle Boutique</h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Nom de la Boutique *
            </label>
            <input
              type="text"
              placeholder="Ex: Épicerie Thiès Express"
              value={form.nomBoutique || ""}
              onChange={(e) => setForm({ ...form, nomBoutique: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                Slug URL (identifiant unique) *
              </label>
              <input
                type="text"
                placeholder="Ex: thies-express"
                value={form.slug || ""}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                Formule d'Abonnement
              </label>
              <select
                value={form.formuleAbonnement || "standard"}
                onChange={(e) => setForm({ ...form, formuleAbonnement: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none", background: "#fff" }}
              >
                <option value="gratuit">Gratuit / Essai</option>
                <option value="standard">Standard (Commission 5%)</option>
                <option value="premium">Premium (Accès Illimité)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Domaine Personnalisé (Optionnel - Ex: comoresbiachara.site)
            </label>
            <input
              type="text"
              placeholder="Ex: comoresbiachara.site"
              value={form.customDomain || ""}
              onChange={(e) => setForm({ ...form, customDomain: e.target.value.toLowerCase() })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none", fontFamily: "monospace" }}
            />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 0" }} />

          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--forest-dark)", display: "flex", alignItems: "center", gap: 6 }}>
            <UserCheck size={16} />
            <span>Compte Administrateur Initial</span>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Nom Complet de l'Admin *
            </label>
            <input
              type="text"
              placeholder="Ex: Mamadou Diallo"
              value={form.nomAdmin || ""}
              onChange={(e) => setForm({ ...form, nomAdmin: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                Email de Connexion *
              </label>
              <input
                type="email"
                placeholder="admin@boutique.com"
                value={form.emailAdmin || ""}
                onChange={(e) => setForm({ ...form, emailAdmin: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                Téléphone de l'Admin
              </label>
              <input
                type="text"
                placeholder="Ex: +269 332 00 00"
                value={form.telephoneAdmin || ""}
                onChange={(e) => setForm({ ...form, telephoneAdmin: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>
                Mot de Passe Généré *
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                style={{ background: "none", border: "none", color: "var(--forest)", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <RefreshCw size={12} /> Régénérer
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={form.motDePasseAdmin || ""}
                onChange={(e) => setForm({ ...form, motDePasseAdmin: e.target.value })}
                style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "var(--muted)"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid var(--border)", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Annuler
          </button>
          <button onClick={handleInternalSubmit} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--forest-dark)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Créer la Boutique & Envoyer Identifiants
          </button>
        </div>
      </div>
    </div>
  );
}
