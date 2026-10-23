import React from "react";
import { X, Pencil, KeyRound } from "lucide-react";

export default function EditBoutiqueModal({ form, setForm, onSubmit, onClose }) {
  if (!form) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)", overflow: "hidden"
      }}>
        {/* HEADER */}
        <div style={{
          padding: "20px 24px", background: "var(--forest-dark)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Pencil size={20} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Modifier « {form.nom} »</h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Nom de la Boutique
            </label>
            <input
              type="text"
              value={form.nom || ""}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Slug (Identifiant URL)
            </label>
            <input
              type="text"
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Domaine Personnalisé (ex: abdou.com)
            </label>
            <input
              type="text"
              placeholder="ex: abdou.com"
              value={form.customDomain || ""}
              onChange={(e) => setForm({ ...form, customDomain: e.target.value.toLowerCase() })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none", fontFamily: "monospace" }}
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

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "8px 0" }} />

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--forest-dark)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <KeyRound size={15} />
              <span>Changer le mot de passe Admin (optionnel)</span>
            </label>
            <input
              type="password"
              placeholder="Laisser vide pour ne pas modifier"
              value={form.motDePasseAdmin || ""}
              onChange={(e) => setForm({ ...form, motDePasseAdmin: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid var(--border)", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Annuler
          </button>
          <button onClick={onSubmit} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--forest-dark)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
