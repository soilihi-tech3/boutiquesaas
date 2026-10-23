import React from "react";
import { X, Pencil, UserCheck, KeyRound, Phone, Mail, Store, Shield } from "lucide-react";

export default function EditUserModal({ form, setForm, boutiques, onSubmit, onClose }) {
  if (!form) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 500,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)", overflow: "hidden"
      }}>
        {/* HEADER */}
        <div style={{
          padding: "20px 24px", background: "var(--forest-dark)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Pencil size={20} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Modifier Utilisateur « {form.nom} »</h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Nom Complet *
            </label>
            <input
              type="text"
              value={form.nom || ""}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                Adresse Email *
              </label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                Téléphone
              </label>
              <input
                type="text"
                value={form.telephone || ""}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                Rôle Système
              </label>
              <select
                value={form.role || "client"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none", background: "#fff" }}
              >
                <option value="client">Client</option>
                <option value="employe">Employé Boutique</option>
                <option value="admin">Admin Boutique</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                Boutique Rattachée
              </label>
              <select
                value={form.boutiqueId || ""}
                onChange={(e) => setForm({ ...form, boutiqueId: e.target.value ? Number(e.target.value) : null })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, outline: "none", background: "#fff" }}
              >
                <option value="">Plateforme Globale (Aucune)</option>
                {boutiques.map(b => (
                  <option key={b.id} value={b.id}>{b.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 0" }} />

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--forest-dark)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <KeyRound size={15} />
              <span>Réinitialiser le Mot de Passe (Optionnel)</span>
            </label>
            <input
              type="password"
              placeholder="Laisser vide si inchangé"
              value={form.motDePasse || ""}
              onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
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
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}
