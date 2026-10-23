import React from "react";
import { AlertCircle, X, Trash2 } from "lucide-react";

export default function ConfirmModal({ title, message, onConfirm, onClose, confirmText = "Supprimer" }) {
  if (!title) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 20
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 440,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)", overflow: "hidden"
      }}>
        <div style={{ padding: "24px 24px 16px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ background: "#FDF2F0", color: "#B4483A", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertCircle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: 18, fontWeight: 800, color: "var(--ink)" }}>{title}</h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: "1.4" }}>{message}</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} style={{ padding: "9px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "9px 18px", borderRadius: 10, border: "none",
              background: "#B4483A", color: "#fff", fontWeight: 700, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}
          >
            <Trash2 size={15} />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
