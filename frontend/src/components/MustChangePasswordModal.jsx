import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function MustChangePasswordModal() {
  const { user, updateUser } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  if (!user || !user.mustChangePassword) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    if (!nouveauMotDePasse || nouveauMotDePasse.length < 6) {
      setErreur("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (nouveauMotDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put("/auth/me", { nouveauMotDePasse });
      updateUser(res.data.user);
      showToast("Mot de passe modifié avec succès ! Bienvenue.", "success", "Sécurité");
      
      // Rediriger selon le rôle une fois le mot de passe modifié
      const updatedUser = res.data.user;
      if (updatedUser?.role === "super_admin") navigate("/super-admin");
      else if (updatedUser?.role === "admin" || updatedUser?.role === "employe") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la mise à jour du mot de passe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(15,23,42,0.75)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16
      }}
    >
      <div
        style={{
          background: "var(--paper, #ffffff)",
          borderRadius: 24,
          padding: 32,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          border: "1px solid var(--line)",
          textAlign: "center"
        }}
      >
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "#FEF3C7", color: "#D97706",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <ShieldAlert size={32} />
        </div>

        <h2 style={{ fontSize: 20, margin: "0 0 8px", color: "var(--forest-dark)" }}>
          Changement de mot de passe obligatoire
        </h2>

        <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "0 0 20px", lineHeight: 1.5 }}>
          Pour des raisons de sécurité, vous vous connectez avec un mot de passe temporaire. Veuillez en définir un nouveau personnalisé pour continuer.
        </p>

        {erreur && (
          <div style={{
            background: "#FDF2F0", color: "#B4483A", padding: "12px 14px",
            borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 8, textAlign: "left"
          }}>
            <AlertCircle size={16} /> {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
          <div className="bs-input-group">
            <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block", color: "var(--ink)" }}>
              Nouveau mot de passe *
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                className="bs-input"
                style={{ paddingRight: 40 }}
                placeholder="Min. 6 caractères"
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "var(--muted)"
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="bs-input-group">
            <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block", color: "var(--ink)" }}>
              Confirmer le nouveau mot de passe *
            </label>
            <input
              type={showPass ? "text" : "password"}
              className="bs-input"
              placeholder="Répétez le mot de passe"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bs-btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: 14, borderRadius: 14, fontSize: 15, fontWeight: 700, marginTop: 8 }}
          >
            {loading ? "Mise à jour..." : "Enregistrer et continuer"}
          </button>
        </form>
      </div>
    </div>
  );
}
