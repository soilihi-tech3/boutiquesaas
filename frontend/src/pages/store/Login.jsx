import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { LogIn, Lock, Mail, AlertCircle, Eye, EyeOff, CheckCircle, KeyRound, ArrowRight, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({ email: "", motDePasse: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal Mot de passe oublié & Réinitialisation
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSucces, setForgotSucces] = useState("");
  const [forgotErreur, setForgotErreur] = useState("");

  // Token de réinitialisation transmis dans l'URL (?resetToken=...)
  const resetToken = params.get("resetToken");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSucces, setResetSucces] = useState("");
  const [resetErreur, setResetErreur] = useState("");

  useEffect(() => {
    if (resetToken) {
      setForgotModalOpen(true);
    }
  }, [resetToken]);

  async function onSubmit(e) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const user = await login(form.email, form.motDePasse);
      const redirect = params.get("redirect");
      if (user?.mustChangePassword) {
        // Le modal MustChangePasswordModal prendra le relais sans rediriger
        return;
      }
      if (redirect) navigate(redirect);
      else if (user.role === "super_admin") navigate("/super-admin");
      else if (user.role === "admin" || user.role === "employe") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setErreur(err.response?.data?.message || "Identifiants ou mot de passe incorrects.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendForgot(e) {
    e.preventDefault();
    setForgotErreur("");
    setForgotSucces("");
    setForgotLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email: forgotEmail });
      setForgotSucces(res.data?.message || "Un e-mail de réinitialisation a été envoyé.");
    } catch (err) {
      setForgotErreur(err.response?.data?.message || "Erreur lors de l'envoi de l'e-mail de réinitialisation.");
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setResetErreur("");
    setResetSucces("");
    setResetLoading(true);

    try {
      const res = await api.post("/auth/reset-password", { token: resetToken, nouveauMotDePasse: newPassword });
      setResetSucces(res.data?.message || "Mot de passe réinitialisé avec succès !");
      setTimeout(() => {
        setForgotModalOpen(false);
        navigate("/connexion");
      }, 2000);
    } catch (err) {
      setResetErreur(err.response?.data?.message || "Lien invalide ou expiré.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="bs-auth-container">
      <div className="bs-auth-card slide-from-left">
        <div className="bs-auth-header">
          <div className="bs-auth-icon">
            <LogIn size={26} color="var(--forest)" />
          </div>
          <h2>Espace Connexion</h2>
          <p>Connectez-vous pour accéder à votre espace </p>
        </div>

        {erreur && (
          <div className="bs-auth-error">
            <AlertCircle size={18} />
            <span>{erreur}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="bs-auth-form">
          <div className="bs-input-group">
            <label>Téléphone ou Adresse e-mail</label>
            <div className="bs-input-wrapper">
              <Mail size={18} className="bs-input-icon" />
              <input
                type="text"
                placeholder="Ex: +269 3300000, 771234567 ou email@domaine.com"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <span style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>
              Vous pouvez saisir votre numéro avec l'indicatif (+221, +269, +33...), sans indicatif,
            </span>
          </div>

          <div className="bs-input-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <label style={{ margin: 0 }}>Mot de passe</label>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(true);
                  setForgotErreur("");
                  setForgotSucces("");
                }}
                style={{
                  background: "none", border: "none", color: "var(--forest)",
                  fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: 0
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="bs-input-wrapper" style={{ position: "relative" }}>
              <Lock size={18} className="bs-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={form.motDePasse}
                onChange={(e) => setForm((f) => ({ ...f, motDePasse: e.target.value }))}
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "var(--muted)",
                  display: "flex", alignItems: "center", justifyContent: "center", padding: 4
                }}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="bs-auth-btn" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="bs-auth-footer">
          <span>Pas encore de compte client ?</span>{" "}
          <Link to="/inscription">Créer un compte</Link>
        </div>
      </div>

      {/* ── MODAL RÉINITIALISATION DU MOT DE PASSE ── */}
      {forgotModalOpen && (
        <div
          onClick={() => setForgotModalOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(22,52,36,0.5)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 20, padding: 32,
              maxWidth: 480, width: "100%", boxShadow: "0 12px 40px rgba(0,0,0,0.2)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--forest-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <KeyRound size={20} color="var(--forest)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: "var(--forest-dark)" }}>
                    {resetToken ? "Nouveau mot de passe" : "Mot de passe oublié"}
                  </h3>
                </div>
              </div>
              <button onClick={() => setForgotModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={20} />
              </button>
            </div>

            {/* CAS 1 : FORMULAIRE DE DEMANDE PAR EMAIL */}
            {!resetToken ? (
              <>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, marginTop: 0, marginBottom: 20 }}>
                  Saisissez votre adresse e-mail. Nous vous enverrons un lien sécurisé pour définir un nouveau mot de passe.
                </p>

                {forgotErreur && (
                  <div className="bs-auth-error" style={{ marginBottom: 16 }}>
                    <AlertCircle size={18} /> <span>{forgotErreur}</span>
                  </div>
                )}
                {forgotSucces && (
                  <div style={{ background: "#EBF7F0", color: "#1F4D3A", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={18} /> {forgotSucces}
                  </div>
                )}

                <form onSubmit={handleSendForgot} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="bs-input-group">
                    <label>Adresse e-mail du compte</label>
                    <div className="bs-input-wrapper">
                      <Mail size={18} className="bs-input-icon" />
                      <input
                        type="email"
                        placeholder="nom@exemple.com"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button className="bs-auth-btn" disabled={forgotLoading}>
                    {forgotLoading ? "Envoi en cours..." : "Recevoir le lien par e-mail"}
                  </button>
                </form>
              </>
            ) : (
              /* CAS 2 : SAISIE DU NOUVEAU MOT DE PASSE (DEPUIS LE LIEN EMAIL) */
              <>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, marginTop: 0, marginBottom: 20 }}>
                  Veuillez saisir votre nouveau mot de passe (6 caractères minimum).
                </p>

                {resetErreur && (
                  <div className="bs-auth-error" style={{ marginBottom: 16 }}>
                    <AlertCircle size={18} /> <span>{resetErreur}</span>
                  </div>
                )}
                {resetSucces && (
                  <div style={{ background: "#EBF7F0", color: "#1F4D3A", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={18} /> {resetSucces}
                  </div>
                )}

                <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="bs-input-group">
                    <label>Nouveau mot de passe</label>
                    <div className="bs-input-wrapper" style={{ position: "relative" }}>
                      <Lock size={18} className="bs-input-icon" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ paddingRight: 42 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                          background: "none", border: "none", cursor: "pointer", color: "var(--muted)",
                          display: "flex", alignItems: "center", justifyContent: "center", padding: 4
                        }}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button className="bs-auth-btn" disabled={resetLoading}>
                    {resetLoading ? "Mise à jour..." : "Enregistrer le nouveau mot de passe"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
