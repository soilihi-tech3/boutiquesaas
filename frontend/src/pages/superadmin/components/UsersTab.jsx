import React, { useState } from "react";
import { Search, ShieldCheck, UserCheck, Users, PauseCircle, PlayCircle, Pencil, Trash2, Filter, Store, Phone, Mail } from "lucide-react";

export default function UsersTab({
  users = [], boutiques = [], onEditUser, onToggleUserStatus, onDeleteUser
}) {
  const [roleFilter, setRoleFilter] = useState("all"); // "all" | "admin_staff" | "client" | "super_admin"
  const [boutiqueFilter, setBoutiqueFilter] = useState("all"); // "all" | "none" | boutiqueId
  const [search, setSearch] = useState("");

  const safeUsers = (Array.isArray(users) ? users : []).filter(Boolean);
  const safeBoutiques = (Array.isArray(boutiques) ? boutiques : []).filter(Boolean);

  // KPIs calculation
  const totalUsers = safeUsers.length;
  const totalAdminsStaff = safeUsers.filter(u => u.role === "admin" || u.role === "employe" || u.role === "super_admin").length;
  const totalClients = safeUsers.filter(u => u.role === "client").length;
  const totalSuspendus = safeUsers.filter(u => u.statut === "suspendu").length;

  // Filtered users list
  const filteredUsers = safeUsers.filter(u => {
    // Search
    const matchSearch = 
      (u.nom || "")?.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "")?.toLowerCase().includes(search.toLowerCase()) ||
      (u.telephone || "")?.toLowerCase().includes(search.toLowerCase());

    // Role filter
    let matchRole = true;
    if (roleFilter === "admin_staff") matchRole = u.role === "admin" || u.role === "employe";
    else if (roleFilter === "client") matchRole = u.role === "client";
    else if (roleFilter === "super_admin") matchRole = u.role === "super_admin";

    // Boutique filter
    let matchBoutique = true;
    if (boutiqueFilter === "none") matchBoutique = !u.boutiqueId;
    else if (boutiqueFilter !== "all") matchBoutique = String(u.boutiqueId) === String(boutiqueFilter);

    return matchSearch && matchRole && matchBoutique;
  });

  return (
    <div>
      {/* ── USER KPIS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#fff", padding: "16px 20px", borderRadius: 14, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Total Utilisateurs Inscrits</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", marginTop: 4 }}>{totalUsers}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Toutes boutiques confondues</div>
        </div>

        <div style={{ background: "#fff", padding: "16px 20px", borderRadius: 14, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Gérants & Admins</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--forest-dark)", marginTop: 4 }}>{totalAdminsStaff}</div>
          <div style={{ fontSize: 11, color: "var(--forest)", marginTop: 2 }}>Admins et employés plateforme</div>
        </div>

        <div style={{ background: "#fff", padding: "16px 20px", borderRadius: 14, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Clients Inscrits</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)", marginTop: 4 }}>{totalClients}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Clients e-commerce</div>
        </div>

        <div style={{ background: "#fff", padding: "16px 20px", borderRadius: 14, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Comptes Suspendus</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#B4483A", marginTop: 4 }}>{totalSuspendus}</div>
          <div style={{ fontSize: 11, color: "#B4483A", marginTop: 2 }}>Accès restreint par l'admin</div>
        </div>
      </div>

      {/* ── FILTERS BAR & TABLE CONTAINER ── */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
        
        {/* TOP BAR WITH SEARCH & FILTERS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", margin: 0, fontFamily: "serif" }}>
              Admins & Utilisateurs ({filteredUsers.length})
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0 0" }}>
              Gérez les rôles, modifiez les profils, suspendez ou supprimez des comptes
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {/* SEARCH */}
            <div style={{ position: "relative" }}>
              <Search size={16} color="var(--muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Rechercher par nom, email, tél..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "9px 12px 9px 36px", borderRadius: 10, border: "1px solid var(--border)",
                  fontSize: 13, width: 220, outline: "none"
                }}
              />
            </div>

            {/* ROLE FILTER */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border)",
                fontSize: 13, outline: "none", background: "#fff", fontWeight: 600, color: "var(--ink)", cursor: "pointer"
              }}
            >
              <option value="all">Tous les rôles</option>
              <option value="admin_staff">Admins & Employés</option>
              <option value="client">Clients</option>
              <option value="super_admin">Super Admins</option>
            </select>

            {/* BOUTIQUE FILTER */}
            <select
              value={boutiqueFilter}
              onChange={(e) => setBoutiqueFilter(e.target.value)}
              style={{
                padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border)",
                fontSize: 13, outline: "none", background: "#fff", fontWeight: 600, color: "var(--ink)", cursor: "pointer"
              }}
            >
              <option value="all">Toutes les boutiques</option>
              <option value="none">Plateforme Globale (Sans boutique)</option>
              {boutiques.map(b => (
                <option key={b.id} value={b.id}>{b.nom}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left" }}>
                <th style={{ padding: "8px 16px" }}>UTILISATEUR</th>
                <th style={{ padding: "8px 16px" }}>CONTACT</th>
                <th style={{ padding: "8px 16px" }}>RÔLE</th>
                <th style={{ padding: "8px 16px" }}>BOUTIQUE RATTACHÉE</th>
                <th style={{ padding: "8px 16px" }}>STATUT</th>
                <th style={{ padding: "8px 16px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 30, color: "var(--muted)", fontSize: 14 }}>
                    Aucun utilisateur ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuspended = u.statut === "suspendu";
                  return (
                    <tr key={u.id} style={{ background: isSuspended ? "#FFF5F5" : "#FAFCFA", borderRadius: 12 }}>
                      {/* USER INFO */}
                      <td style={{ padding: "14px 16px", borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: u.role === "super_admin" ? "var(--accent)" : u.role === "admin" ? "var(--forest-dark)" : "#E2E8F0",
                            color: u.role === "client" ? "#475569" : "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14
                          }}>
                            {u.nom ? u.nom.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{u.nom}</div>
                            <div style={{ fontSize: 11, color: "var(--muted)" }}>ID #{u.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--muted)" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink)", fontSize: 12, fontWeight: 500 }}>
                            <Mail size={12} color="var(--muted)" />
                            <span>{u.email || "Sans email"}</span>
                          </div>
                          {u.telephone && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 11 }}>
                              <Phone size={11} />
                              <span>{u.telephone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* ROLE */}
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                          background: u.role === "super_admin" ? "#FFF4EB" : u.role === "admin" ? "#EBF7F0" : "#F1F5F9",
                          color: u.role === "super_admin" ? "var(--accent)" : u.role === "admin" ? "var(--forest-dark)" : "#475569",
                          border: `1px solid ${u.role === "super_admin" ? "#FFD8BF" : u.role === "admin" ? "#C4E5D3" : "#CBD5E1"}`
                        }}>
                          {u.role === "super_admin" && <ShieldCheck size={13} />}
                          {u.role === "admin" && <UserCheck size={13} />}
                          <span style={{ textTransform: "capitalize" }}>
                            {u.role === "admin" ? "Admin Boutique" : u.role === "employe" ? "Employé" : u.role === "super_admin" ? "Super Admin" : "Client"}
                          </span>
                        </span>
                      </td>

                      {/* BOUTIQUE */}
                      <td style={{ padding: "14px 16px", fontSize: 13 }}>
                        {u.boutique ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--ink)" }}>
                            <Store size={14} color="var(--forest)" />
                            <span>{u.boutique.nom}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "var(--muted)", italic: true }}>Plateforme Globale</span>
                        )}
                      </td>

                      {/* STATUT */}
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: !isSuspended ? "#EBF7F0" : "#FDF2F0",
                          color: !isSuspended ? "#1F4D3A" : "#B4483A",
                          border: `1px solid ${!isSuspended ? "#C4E5D3" : "#F8D7D2"}`
                        }}>
                          {!isSuspended ? "Actif" : "Suspendu"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: "14px 16px", textAlign: "right", borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          {/* Modifier */}
                          <button
                            onClick={() => onEditUser(u)}
                            title="Modifier l'utilisateur"
                            style={{
                              background: "#fff", border: "1px solid var(--border)", borderRadius: 8,
                              padding: 6, color: "var(--ink)", cursor: "pointer", display: "flex"
                            }}
                          >
                            <Pencil size={15} />
                          </button>

                          {/* Suspendre / Réactiver */}
                          <button
                            onClick={() => onToggleUserStatus(u)}
                            title={isSuspended ? "Réactiver le compte" : "Suspendre le compte"}
                            style={{
                              background: !isSuspended ? "#FDF2F0" : "#EBF7F0",
                              border: `1px solid ${!isSuspended ? "#F8D7D2" : "#C4E5D3"}`,
                              borderRadius: 8, padding: 6,
                              color: !isSuspended ? "#B4483A" : "#1F4D3A",
                              cursor: "pointer", display: "flex"
                            }}
                          >
                            {isSuspended ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
                          </button>

                          {/* Supprimer */}
                          <button
                            onClick={() => onDeleteUser(u)}
                            title="Supprimer l'utilisateur"
                            style={{
                              background: "#FDF2F0", border: "1px solid #F8D7D2", borderRadius: 8,
                              padding: 6, color: "#B4483A", cursor: "pointer", display: "flex"
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
