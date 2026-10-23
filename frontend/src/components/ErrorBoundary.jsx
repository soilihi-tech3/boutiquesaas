import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px 20px",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          maxWidth: "600px",
          margin: "80px auto",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid #E2E8E3"
        }}>
          <h2 style={{ color: "#224B35", marginTop: 0 }}>Une erreur s'est produite</h2>
          <p style={{ color: "#64746A", fontSize: "14px" }}>
            {this.state.error?.message || "Erreur de chargement."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#224B35",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "20px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "12px"
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
