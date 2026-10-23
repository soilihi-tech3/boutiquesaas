import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, ShoppingBag, CheckCircle, Clock, AlertCircle } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";

import { subscribeRealtime } from "../utils/realtime.js";

export default function NotificationMenu() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  function load() {
    if (!user) return;
    api.get("/notifications")
      .then((res) => setNotifications(res.data || []))
      .catch(() => {});
  }

  useEffect(() => {
    load();

    // SSE real-time push listener (NO 4s polling -> zero 304 console loops!)
    const unsubscribe = subscribeRealtime((detail) => {
      if (detail.type === "order_updated" || detail.type === "order_created") {
        load();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // Click outside to close
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  // Seules les notifications non lues sont conservées dans le menu
  const unreadNotifications = notifications.filter((n) => !n.lu);
  const unreadCount = unreadNotifications.length;

  async function handleNotificationClick(n) {
    // Faire disparaître immédiatement CETTE notification spécifique de la liste
    setNotifications((prev) => prev.filter((item) => item.id !== n.id));
    api.patch(`/notifications/${n.id}/read`).catch(() => {});
    setOpen(false);

    const titleLower = (n.title || "").toLowerCase();
    const msgLower = (n.message || "").toLowerCase();
    const typeLower = (n.type || "").toLowerCase();

    const isProductRelated =
      n.productId ||
      typeLower.includes("product") ||
      typeLower.includes("stock") ||
      typeLower.includes("exspir") ||
      titleLower.includes("produit") ||
      titleLower.includes("stock") ||
      titleLower.includes("expir") ||
      msgLower.includes("produit") ||
      msgLower.includes("stock") ||
      msgLower.includes("expir");

    if (isProductRelated) {
      if (user.role === "admin" || user.role === "employe") {
        navigate("/admin/produits");
      } else if (n.productId) {
        navigate(`/produit/${n.productId}`);
      } else {
        navigate("/catalogue");
      }
    } else {
      if (user.role === "client") {
        navigate("/mes-commandes");
      } else if (user.role === "admin" || user.role === "employe") {
        navigate("/admin/commandes");
      }
    }
  }

  async function markAllRead() {
    // Vider la liste immédiatement en marquant tout comme lu
    setNotifications([]);
    api.patch("/notifications/read-all").catch(() => {});
  }

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        title="Notifications"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
          color: "var(--ink)",
          borderRadius: "50%",
          transition: "background 0.2s"
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "#B4483A",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              borderRadius: 10,
              padding: "1px 5px",
              lineHeight: 1,
              boxShadow: "0 2px 6px rgba(180,72,58,0.4)"
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 10px)",
            width: 340,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 10px 36px rgba(22,52,36,0.18)",
            border: "1px solid var(--line)",
            zIndex: 1000,
            overflow: "hidden"
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "14px 18px",
              background: "var(--paper)",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--forest-dark)" }}>
              Notifications ({unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Toutes lues"})
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--forest)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <Check size={14} /> Tout lire
              </button>
            )}
          </div>

          {/* LIST */}
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {unreadNotifications.length === 0 ? (
              <div style={{ padding: "28px 18px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                Aucune notification pour le moment.
              </div>
            ) : (
              unreadNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--line)",
                    background: "var(--forest-light)",
                    cursor: "pointer",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#E2EFE7")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--forest-light)")}
                >
                  <div
                    style={{
                      background: "var(--forest)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2
                    }}
                  >
                    <ShoppingBag size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: 10.5, color: "var(--sage)", marginTop: 4 }}>
                      {new Date(n.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flexShrink: 0,
                      marginTop: 6
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
