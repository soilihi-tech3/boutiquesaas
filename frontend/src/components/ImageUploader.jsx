import React, { useRef, useState } from "react";
import { Upload, Link2, X, Loader } from "lucide-react";
import api from "../api";

/**
 * ImageUploader — lets the user pick a file from disk OR paste a URL.
 * Converts local files into lightweight compressed Base64 Data URLs so they work everywhere.
 *
 * Props:
 *   value    {string}   current image URL or Base64 string
 *   onChange {fn}       called with the new URL string
 *   label    {string}   field label
 */
export default function ImageUploader({ value, onChange, label = "Image" }) {
  const inputRef = useRef(null);
  const [mode, setMode] = useState("file"); // "file" | "url"
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Compress image using HTML5 Canvas for ultra-light payload & high sharpness
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Lightweight JPEG Data URL (~40KB) saved directly in database
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.70);
          onChange(compressedDataUrl);
        } catch (err) {
          // Fallback to raw base64 if canvas compression encounters issues
          onChange(event.target.result);
        } finally {
          setUploading(false);
          if (inputRef.current) inputRef.current.value = "";
        }
      };

      img.onerror = () => {
        // Direct base64 fallback
        onChange(event.target.result);
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      setError("Impossible de lire la photo sélectionnée.");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="bs-input-group">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={{ margin: 0 }}>{label}</label>
        <div style={{ display: "flex", gap: 4 }}>
          <button type="button" onClick={() => setMode("file")} style={{
            padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1.5px solid",
            borderColor: mode === "file" ? "var(--forest)" : "var(--line)",
            background: mode === "file" ? "var(--forest-light)" : "transparent",
            color: mode === "file" ? "var(--forest-dark)" : "var(--muted)", cursor: "pointer"
          }}>
            <Upload size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />Depuis l'appareil
          </button>
          <button type="button" onClick={() => setMode("url")} style={{
            padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1.5px solid",
            borderColor: mode === "url" ? "var(--forest)" : "var(--line)",
            background: mode === "url" ? "var(--forest-light)" : "transparent",
            color: mode === "url" ? "var(--forest-dark)" : "var(--muted)", cursor: "pointer"
          }}>
            <Link2 size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />Par URL
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <input
          className="bs-input"
          placeholder="https://images.unsplash.com/..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed var(--line)", borderRadius: 10, padding: "20px 16px",
            textAlign: "center", cursor: "pointer", background: "var(--paper)",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--forest)"; e.currentTarget.style.background = "var(--forest-light)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "var(--paper)"; }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {uploading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--forest)" }}>
              <Loader size={18} style={{ animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Optimisation & Traitement...</span>
            </div>
          ) : (
            <>
              <Upload size={24} color="var(--sage)" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>Cliquez pour choisir une photo sur votre appareil</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>JPEG, PNG, WEBP — conversion universelle automatique</div>
            </>
          )}
        </div>
      )}

      {error && <div style={{ fontSize: 12, color: "#B4483A", marginTop: 6 }}>{error}</div>}

      {/* Preview */}
      {value && (
        <div style={{ position: "relative", display: "inline-block", marginTop: 10 }}>
          <img
            src={value}
            alt="Aperçu photo"
            style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            title="Supprimer cette photo"
            style={{
              position: "absolute", top: -6, right: -6, width: 22, height: 22,
              borderRadius: "50%", border: "none", background: "#B4483A", color: "#fff",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
