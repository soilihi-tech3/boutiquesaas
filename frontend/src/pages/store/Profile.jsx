import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Phone, Mail, MapPin, Lock, CheckCircle2, AlertCircle, LogOut, ArrowLeft, Save, ShieldCheck, Eye, EyeOff } from "lucide-react";
import api from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import PhoneInputSelect from "../../components/PhoneInputSelect.jsx";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    adresse: user?.adresse || "",
    ancienMotDePasse: "",
    nouveauMotDePasse: ""
  });

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        nom: user.nom || "",
        email: user.email || "",
        telephone: user.telephone || "",
        adresse: user.adresse || ""
      }));
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.put("/auth/me", form);
      const updatedUser = res.data.user;
      
      // Mettre à jour le state global dans AuthContext
      updateUser(updatedUser);

      setMessage("Vos informations personnelles ont été enregistrées avec succès !");
      showToast("Profil mis à jour avec succès !", "success", "Enregistré");

      setForm((f) => ({ ...f, ancienMotDePasse: "", nouveauMotDePasse: "" }));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Impossible de mettre à jour votre profil.";
      setErreur(errorMsg);
      showToast(errorMsg, "error", "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: "32px auto", padding: "0 16px" }}>
      {/* Bouton Retour intelligent */}
      <button
        type="button"
        onClick={() => {
          if (user?.role === "super_admin") {
            navigate("/super-admin");
          } else if (user?.role === "admin" || user?.role === "employe") {
            navigate("/admin");
          } else {
            navigate(-1);
          }
        }}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          cursor: "pointer", color: "var(--muted)", fontWeight: 700, fontSize: 13.5, marginBottom: 20
        }}
      >
        <ArrowLeft size={16} /> {user?.role === "super_admin" || user?.role === "admin" || user?.role === "employe" ? "Retourner au Tableau de Bord" : "Retourner"}
      </button>

      {/* CARTE PRINCIPALE DE PROFIL */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "36px 32px",
          border: "1px solid var(--line)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
        }}
      >
        {/* HEADER PROFIL */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 28, borderBottom: "1px solid var(--line)", marginBottom: 28 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: "50%", background: "var(--forest)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 26, boxShadow: "0 6px 16px rgba(34,75,53,0.25)"
            }}
          >
            {user?.nom?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 24, margin: "0 0 4px", color: "var(--forest-dark)" }}>
              {user?.nom || "Mon Profil"}
            </h1>
            <div style={{ fontSize: 13.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{user?.email || user?.telephone}</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--muted)" }} />
              <span style={{ textTransform: "capitalize", fontWeight: 700, color: "var(--forest)" }}>
                {user?.role === "client" ? "Compte Client Privilégié" : user?.role === "admin" ? "Administrateur" : user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS SUCCÈS ET ERREUR */}
        {message && (
          <div
            style={{
              background: "#EBF7F0", color: "#1F4D3A", border: "1px solid #C8E6C9",
              padding: "14px 18px", borderRadius: 14, fontSize: 14, fontWeight: 600,
              marginBottom: 24, display: "flex", alignItems: "center", gap: 10
            }}
          >
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        {erreur && (
          <div
            style={{
              background: "#FDF2F0", color: "#B4483A", border: "1px solid #F8D7D2",
              padding: "14px 18px", borderRadius: 14, fontSize: 14, fontWeight: 600,
              marginBottom: 24, display: "flex", alignItems: "center", gap: 10
            }}
          >
            <AlertCircle size={18} /> {erreur}
          </div>
        )}

        {/* FORMULAIRE DE PROFIL */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="bs-input-group">
            <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <User size={15} color="var(--forest)" /> Nom complet
            </label>
            <input
              type="text"
              className="bs-input"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Prénom et Nom"
            />
          </div>

          <div className="bs-form-row-2">
            <div className="bs-input-group">
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Mail size={15} color="var(--forest)" /> Adresse E-mail
              </label>
              <input
                type="email"
                className="bs-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div className="bs-input-group">
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Phone size={15} color="var(--forest)" /> Numéro de téléphone principal *
              </label>
              <PhoneInputSelect
                value={form.telephone}
                onChange={(val) => setForm({ ...form, telephone: val })}
                placeholder="Ex: 330 00 00 ou 77 123 45 67"
              />
            </div>
          </div>

          <div className="bs-input-group">
            <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={15} color="var(--forest)" /> Adresse de livraison par défaut
            </label>
            <input
              type="text"
              className="bs-input"
              placeholder="Ex: Sacré-Cœur 3, Villa 123, Dakar ou Moroni Oasis"
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
            />
            <span style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>
              Cette adresse sera automatiquement présélectionnée lors de la validation de vos commandes.
            </span>
          </div>

          <div style={{ margin: "12px 0 4px", borderTop: "1.5px dashed var(--line)", paddingTop: 20 }}>
            <h3 style={{ fontSize: 16, color: "var(--forest-dark)", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <Lock size={16} /> Modification du mot de passe (Optionnel)
            </h3>

            <div className="bs-form-row-2">
              <div className="bs-input-group" style={{ position: "relative" }}>
                <label style={{ fontSize: 12.5, color: "var(--muted)" }}>Ancien mot de passe</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showOldPass ? "text" : "password"}
                    className="bs-input"
                    style={{ paddingRight: 40 }}
                    placeholder="Laisser vide si inchangé"
                    value={form.ancienMotDePasse}
                    onChange={(e) => setForm({ ...form, ancienMotDePasse: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "var(--muted)"
                    }}
                  >
                    {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bs-input-group" style={{ position: "relative" }}>
                <label style={{ fontSize: 12.5, color: "var(--muted)" }}>Nouveau mot de passe</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPass ? "text" : "password"}
                    className="bs-input"
                    style={{ paddingRight: 40 }}
                    placeholder="Min. 6 caractères"
                    value={form.nouveauMotDePasse}
                    onChange={(e) => setForm({ ...form, nouveauMotDePasse: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "var(--muted)"
                    }}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, marginTop: 16 }}>
            <button
              type="submit"
              className="bs-btn-primary"
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "14px 32px",
                fontSize: 15, borderRadius: 30, boxShadow: "0 4px 14px rgba(34,75,53,0.2)"
              }}
            >
              <Save size={18} /> {loading ? "Enregistrement en cours..." : "Enregistrer mes modifications"}
            </button>
          </div>
        </form>

        {/* DÉCONNEXION */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Besoin de vous déconnecter ?
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              showToast("Déconnexion réussie.", "info");
              navigate("/");
            }}
            style={{
              background: "#FDF2F0", color: "#B4483A", border: "1px solid #F8D7D2",
              padding: "10px 20px", borderRadius: 24, fontWeight: 700, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}
          >
            <LogOut size={15} /> Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
