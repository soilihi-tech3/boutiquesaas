import React, { useState } from "react";
import { X, User, Phone, MapPin, KeyRound, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfileModal({ onClose }) {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    nom: user?.nom || "",
    telephone: user?.telephone || "",
    adresse: user?.adresse || "",
    ancienMotDePasse: "",
    nouveauMotDePasse: ""
  });

  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.put("/auth/me", form);
      setMessage("Votre profil a été mis à jour avec succès !");
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErreur(err.response?.data?.message || "Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(22,52,36,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, padding: "28px 28px 24px",
          maxWidth: 480, width: "100%", boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: "var(--forest)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 18, boxShadow: "0 4px 12px rgba(34,75,53,0.25)"
            }}>
              {user?.nom?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, color: "var(--forest-dark)" }}>Mon Profil</h3>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {message && (
          <div style={{ background: "#EBF7F0", color: "#1F4D3A", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} /> {message}
          </div>
        )}
        {erreur && (
          <div style={{ background: "#FDF2F0", color: "#B4483A", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={16} /> {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 4 }}>Nom complet</label>
            <input
              className="bs-input"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 4 }}>Numéro de téléphone</label>
            <input
              className="bs-input"
              placeholder="ex: +221 77 123 45 67"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 4 }}>Adresse de livraison par défaut</label>
            <input
              className="bs-input"
              placeholder="ex: Sacré-Cœur 3, Villa 123, Dakar"
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
            />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "4px 0" }} />

          <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--forest-dark)" }}>Modifier le mot de passe</div>

          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Ancien mot de passe</label>
            <input
              type="password"
              className="bs-input"
              placeholder="Laissez vide pour ne pas changer"
              value={form.ancienMotDePasse}
              onChange={(e) => setForm({ ...form, ancienMotDePasse: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>Nouveau mot de passe</label>
            <input
              type="password"
              className="bs-input"
              placeholder="Nouveau mot de passe"
              value={form.nouveauMotDePasse}
              onChange={(e) => setForm({ ...form, nouveauMotDePasse: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: "12px", borderRadius: 30, border: "1px solid var(--line)", background: "#fff", fontWeight: 600, cursor: "pointer" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bs-btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            style={{
              width: "100%", padding: "12px", borderRadius: 30,
              background: "#FDF2F0", color: "#B4483A", border: "1px solid #F8D7D2",
              fontWeight: 700, fontSize: 13.5, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            <LogOut size={16} /> Se déconnecter de mon compte
          </button>
        </div>
      </div>
    </div>
  );
}
