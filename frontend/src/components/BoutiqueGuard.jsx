import React from "react";
import { Store, AlertCircle, RefreshCw } from "lucide-react";
import { useBoutique } from "../context/BoutiqueContext";

export default function BoutiqueGuard({ children }) {
  const { boutique, loading, error, refreshBoutique } = useBoutique();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", background: "#f8fafc", position: "relative", overflow: "hidden"
      }}>
        <style>{`
          @keyframes bq-spin { to { transform: rotate(360deg); } }
          @keyframes bq-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.95); } }
          @keyframes bq-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>

        {/* Decorative background blurs */}
        <div style={{ position: "absolute", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(255,255,255,0) 70%)", top: "-10%", left: "-10%", borderRadius: "50%" }}></div>
        <div style={{ position: "absolute", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0) 70%)", bottom: "-10%", right: "-10%", borderRadius: "50%" }}></div>
        
        {/* Animated Icon */}
        <div style={{
          position: "relative", width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30, animation: "bq-float 3s ease-in-out infinite"
        }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#10B981", borderRightColor: "#3B82F6",
            animation: "bq-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite"
          }} />
          <div style={{
            position: "absolute", inset: 10, borderRadius: "50%", border: "3px solid transparent", borderBottomColor: "#10B981", borderLeftColor: "#3B82F6",
            animation: "bq-spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse"
          }} />
          <Store size={36} color="#059669" style={{ animation: "bq-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        </div>

        {/* Text */}
        <div style={{
          fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em", marginBottom: 8,
          background: "linear-gradient(90deg, #059669, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Préparation de la boutique
        </div>
        <div style={{ color: "#64748b", fontSize: 15, fontWeight: 500, animation: "bq-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
          Chargement sécurisé en cours...
        </div>
      </div>
    );
  }

  if (error || !boutique) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", background: "#F4F7F5", padding: 24, textAlignment: "center"
      }}>
        <div style={{
          background: "#FFF5F5", border: "1px solid #FED7D7", color: "#C53030",
          width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
        }}>
          <AlertCircle size={32} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", margin: "0 0 8px 0" }}>
          Boutique introuvable
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: 440, textAlign: "center", lineHeight: "1.5", fontSize: 14, margin: "0 0 24px 0" }}>
          Le sous-domaine ou l'adresse demandée ne correspond à aucune boutique active sur notre plateforme. Veuillez vérifier l'URL ou essayer plus tard.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={refreshBoutique}
            style={{
              padding: "10px 18px", borderRadius: 12, border: "1px solid var(--border)",
              background: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}
          >
            <RefreshCw size={15} />
            <span>Réessayer</span>
          </button>
        </div>
      </div>
    );
  }

  if (boutique.statut === "suspendue") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", background: "#F4F7F5", padding: 24
      }}>
        <div style={{
          background: "#FFF5F5", border: "1px solid #FED7D7", color: "#C53030",
          width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
        }}>
          <Store size={32} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", margin: "0 0 8px 0" }}>
          Boutique temporairement indisponible
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: 460, textAlign: "center", lineHeight: "1.5", fontSize: 14, margin: "0 0 24px 0" }}>
          La boutique <b>« {boutique.nom} »</b> est actuellement suspendue par l'équipe d'administration de la plateforme.
        </p>
      </div>
    );
  }

  return children;
}
