import React from "react";
import { Store, DollarSign, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { fcfa } from "./constants";

export default function SuperAdminKpis({ stats, boutiques = [], users = [] }) {
  const safeBoutiques = Array.isArray(boutiques) ? boutiques : [];
  const safeUsers = Array.isArray(users) ? users : [];

  const nbActives = stats?.nbBoutiquesActives ?? safeBoutiques.filter(b => b && b.statut === "active").length;
  const totalBoutiques = stats?.nbBoutiques ?? safeBoutiques.length;
  const caCumule = stats?.chiffreAffairesCumule ?? safeBoutiques.reduce((s, b) => s + (b?.chiffreAffaires || 0), 0);
  const totalVentes = stats?.nbVentesCumulees ?? safeBoutiques.reduce((s, b) => s + (b?.nbVentes || 0), 0);
  const totalUsers = stats?.totalUsers ?? safeUsers.length;
  const totalAdmins = stats?.totalAdmins ?? safeUsers.filter(u => u && (u.role === "admin" || u.role === "employe")).length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
      {/* CARD 1: BOUTIQUES */}
      <div style={{
        background: "#fff", padding: "20px 22px", borderRadius: 16,
        border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Boutiques Actives</span>
          <div style={{ background: "#EBF7F0", color: "var(--forest)", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Store size={18} />
          </div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)" }}>
          {nbActives} <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 500 }}>/ {totalBoutiques}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          {totalBoutiques - nbActives} boutique(s) suspendue(s)
        </div>
      </div>

      {/* CARD 2: CHIFFRE D'AFFAIRES */}
      <div style={{
        background: "#fff", padding: "20px 22px", borderRadius: 16,
        border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Chiffre d'Affaires Global</span>
          <div style={{ background: "#FFF4EB", color: "var(--accent)", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={18} />
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)" }}>
          {fcfa(caCumule)}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          Volume total des ventes réalisées
        </div>
      </div>

      {/* CARD 3: VENTES CUMULEES */}
      <div style={{
        background: "#fff", padding: "20px 22px", borderRadius: 16,
        border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Ventes Cumulées</span>
          <div style={{ background: "#E8F4F8", color: "#1D70B8", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={18} />
          </div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)" }}>
          {totalVentes}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          Commandes enregistrées
        </div>
      </div>

      {/* CARD 4: TOTAL UTILISATEURS & GERANTS */}
      <div style={{
        background: "#fff", padding: "20px 22px", borderRadius: 16,
        border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Total Inscrits</span>
          <div style={{ background: "#F3E8FF", color: "#7E22CE", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={18} />
          </div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)" }}>
          {totalUsers} <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>membres</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <ShieldCheck size={13} color="var(--forest)" />
          <span>{totalAdmins} gérant(s) & admin(s)</span>
        </div>
      </div>
    </div>
  );
}
