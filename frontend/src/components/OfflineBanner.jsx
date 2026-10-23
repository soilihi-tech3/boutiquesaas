import React from "react";
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from "lucide-react";
import { useOffline } from "../context/OfflineContext.jsx";

export default function OfflineBanner() {
  const { isOnline, isSyncing, pendingCount, syncOfflineQueue, syncToast } = useOffline();

  return (
    <>
      {/* OFFLINE STATUS TOP BANNER */}
      {!isOnline && (
        <div className="bs-offline-banner">
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <WifiOff size={18} className="bs-offline-pulse" />
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Mode Hors Connexion : Navigation & commandes actives. Synchronisation automatique au retour du réseau.
            </span>
          </div>
          {pendingCount > 0 && (
            <span className="bs-offline-chip">
              {pendingCount} action(s) en attente
            </span>
          )}
        </div>
      )}

      {/* SYNCING IN PROGRESS BAR */}
      {isOnline && isSyncing && (
        <div className="bs-offline-banner syncing">
          <RefreshCw size={16} className="spin" />
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            Synchronisation de vos actions hors ligne en cours...
          </span>
        </div>
      )}

      {/* RECONNECT SYNC TOAST */}
      {syncToast && (
        <div className="bs-sync-toast">
          <CheckCircle2 size={18} color="#10B981" />
          <span>{syncToast}</span>
        </div>
      )}
    </>
  );
}
