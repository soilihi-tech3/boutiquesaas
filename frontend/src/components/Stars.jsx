import React from "react";
import { Star } from "lucide-react";

export default function Stars({ note = 0, size = 13 }) {
  const full = Math.round(note);
  return (
    <span className="bs-stars" style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star 
          key={i} 
          size={size} 
          color={i <= full ? "#FFC107" : "#E2E8E3"} 
          fill={i <= full ? "#FFC107" : "none"} 
          strokeWidth={i <= full ? 0 : 2} 
        />
      ))}
    </span>
  );
}
