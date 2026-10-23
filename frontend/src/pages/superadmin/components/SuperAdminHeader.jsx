import React from "react";
import { Link } from "react-router-dom";
import { RefreshCw, PlusCircle, UserPlus, Sun, Moon, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function SuperAdminHeader({ onRefresh, onNewBoutique, onNewUser, loading }) {
  const { user, theme, toggleTheme } = useAuth();

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 28, flexWrap: "wrap", gap: 16
    }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", fontFamily: "serif", margin: 0 }}>
          Console Super Administrateur
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0 0" }}>
          Gérez toutes les boutiques e-commerce et administrateurs de la plateforme EasyMarket
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* BOUTON BASCULER DE THÈME (DARK / LIGHT) */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          style={{
            background: "var(--card-bg, #fff)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease"
          }}
        >
          {theme === "dark" ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="var(--forest-dark)" />}
        </button>

        {/* LIEN PROFIL SUPER ADMIN */}
        <Link
          to="/profil"
          title="Mon profil Super Admin"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px", borderRadius: 12, border: "1px solid var(--border)",
            background: "var(--card-bg, #fff)", color: "var(--ink)", fontWeight: 700, fontSize: 13,
            textDecoration: "none", boxShadow: "0 2px 5px rgba(0,0,0,0.04)", height: 40, boxSizing: "border-box"
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: "50%", background: "var(--accent)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 12
          }}>
            {user?.nom?.charAt(0).toUpperCase() || "S"}
          </div>
          <span>Super Admin</span>
        </Link>

        {/* ACTUALISER */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Actualiser les données"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 12px", borderRadius: 12, border: "1px solid var(--border)",
            background: "var(--card-bg, #fff)", color: "var(--ink)", fontWeight: 600, fontSize: 13,
            cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.04)", height: 40
          }}
        >
          <RefreshCw size={15} className={loading ? "spin" : ""} />
          <span>Actualiser</span>
        </button>

        {/* AJOUTER UTILISATEUR */}
        <button
          onClick={onNewUser}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 12, border: "1px solid var(--border)",
            background: "var(--card-bg, #fff)", color: "var(--ink)", fontWeight: 700, fontSize: 13,
            cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.04)", height: 40
          }}
        >
          <UserPlus size={16} color="var(--accent)" />
          <span>Créer un utilisateur</span>
        </button>

        {/* AJOUTER BOUTIQUE */}
        <button
          onClick={onNewBoutique}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 12, border: "none",
            background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: 13,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(217,119,36,0.3)", height: 40
          }}
        >
          <PlusCircle size={16} />
          <span>Ajouter une boutique</span>
        </button>
      </div>
    </header>
  );
}
