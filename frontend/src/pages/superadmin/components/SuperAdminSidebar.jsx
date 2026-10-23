import React from "react";
import { 
  Shield, Building2, TrendingUp, Users, Globe, PlusCircle, LogOut 
} from "lucide-react";

export default function SuperAdminSidebar({ activeTab, setActiveTab, boutiquesCount, usersCount, user, logout, onNewBoutique }) {
  return (
    <aside style={{
      background: "#163424",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      padding: "24px 18px",
      boxShadow: "4px 0 20px rgba(0,0,0,0.15)"
    }}>
      {/* BRAND */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.12)",
        marginBottom: 28
      }}>
        <div style={{
          background: "var(--accent)", color: "#fff",
          borderRadius: 12, width: 42, height: 42,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Shield size={24} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", color: "#fff" }}>Super Admin</div>
          <div style={{ fontSize: 12, color: "#A8C3B3" }}>Console Plateforme</div>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <button
          onClick={() => setActiveTab("dashboard")}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px", borderRadius: 12, border: "none",
            background: activeTab === "dashboard" ? "rgba(255,255,255,0.14)" : "transparent",
            color: activeTab === "dashboard" ? "#fff" : "#C2D5C8",
            fontWeight: activeTab === "dashboard" ? 700 : 500,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s ease", textAlign: "left"
          }}
        >
          <TrendingUp size={18} />
          <span>Vue d'ensemble</span>
        </button>

        <button
          onClick={() => setActiveTab("boutiques")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", borderRadius: 12, border: "none",
            background: activeTab === "boutiques" ? "rgba(255,255,255,0.14)" : "transparent",
            color: activeTab === "boutiques" ? "#fff" : "#C2D5C8",
            fontWeight: activeTab === "boutiques" ? 700 : 500,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Building2 size={18} />
            <span>Gestion Boutiques</span>
          </div>
          <span style={{
            background: "rgba(255,255,255,0.2)", color: "#fff",
            borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 700
          }}>
            {boutiquesCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", borderRadius: 12, border: "none",
            background: activeTab === "users" ? "rgba(255,255,255,0.14)" : "transparent",
            color: activeTab === "users" ? "#fff" : "#C2D5C8",
            fontWeight: activeTab === "users" ? 700 : 500,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Users size={18} />
            <span>Admins & Utilisateurs</span>
          </div>
          <span style={{
            background: "rgba(255,255,255,0.2)", color: "#fff",
            borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 700
          }}>
            {usersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("global_modules")}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px", borderRadius: 12, border: "none",
            background: activeTab === "global_modules" ? "rgba(255,255,255,0.14)" : "transparent",
            color: activeTab === "global_modules" ? "#fff" : "#C2D5C8",
            fontWeight: activeTab === "global_modules" ? 700 : 500,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s ease", textAlign: "left"
          }}
        >
          <Globe size={18} />
          <span>Modules de l'App</span>
        </button>
      </nav>

      {/* QUICK ADD BUTTON */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <button
          onClick={onNewBoutique}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 12, border: "none",
            background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: 14,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 12px rgba(224,123,54,0.3)"
          }}
        >
          <PlusCircle size={18} />
          <span>Nouvelle Boutique</span>
        </button>
      </div>

      {/* FOOTER USER INFO */}
      <div style={{
        paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {user?.nom || "Super Admin"}
          </div>
          <div style={{ fontSize: 11, color: "#A8C3B3", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={logout}
          title="Se déconnecter"
          style={{
            background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
            borderRadius: 8, width: 34, height: 34, display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
