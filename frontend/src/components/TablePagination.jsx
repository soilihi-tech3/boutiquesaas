import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination({
  totalItems = 0,
  pageSize = 10,
  onPageSizeChange,
  currentPage = 1,
  onPageChange
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      background: "#fff",
      borderTop: "1px solid var(--line)",
      borderRadius: "0 0 16px 16px",
      flexWrap: "wrap",
      gap: 12
    }}>
      {/* PAGE SIZE SELECTOR */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
        <span>Afficher</span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          style={{
            padding: "5px 10px",
            borderRadius: 8,
            border: "1px solid var(--line)",
            background: "var(--paper)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--forest-dark)",
            cursor: "pointer"
          }}
        >
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>éléments par page</span>
      </div>

      {/* COUNTER INFO */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
        Affichage de <span style={{ color: "var(--forest-dark)", fontWeight: 800 }}>{startItem}</span> à <span style={{ color: "var(--forest-dark)", fontWeight: 800 }}>{endItem}</span> sur <span style={{ color: "var(--forest-dark)", fontWeight: 800 }}>{totalItems}</span>
      </div>

      {/* PAGINATION NAVIGATION BUTTONS */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid var(--line)",
            background: currentPage <= 1 ? "var(--paper)" : "#fff",
            color: currentPage <= 1 ? "var(--muted)" : "var(--forest-dark)",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: currentPage <= 1 ? "not-allowed" : "pointer",
            transition: "all 0.15s"
          }}
        >
          <ChevronLeft size={16} /> Précédent
        </button>

        <span style={{ fontSize: 12.5, fontWeight: 700, padding: "0 8px", color: "var(--forest-dark)" }}>
          Page {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid var(--line)",
            background: currentPage >= totalPages ? "var(--paper)" : "#fff",
            color: currentPage >= totalPages ? "var(--muted)" : "var(--forest-dark)",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
            transition: "all 0.15s"
          }}
        >
          Suivant <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
