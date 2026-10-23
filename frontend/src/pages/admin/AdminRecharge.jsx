import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, PhoneCall, TrendingUp, Tag, GripVertical } from "lucide-react";
import api, { SLUG } from "../../api";

export default function AdminRecharge() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const [formData, setFormData] = useState({
    eur: "",
    kmf: "",
    label: "",
    operator: "hury", // 'hury' or 'telma'
    popular: false,
    promo: false,
    active: true,
    orderIndex: 0
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/store/${SLUG}/admin/recharge-plans`);
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      showNotification("Erreur lors du chargement des forfaits.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setFormData({
      eur: plan.eur,
      kmf: plan.kmf,
      label: plan.label || "",
      operator: plan.operator,
      popular: plan.popular,
      promo: plan.promo,
      active: plan.active,
      orderIndex: plan.orderIndex || 0
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ eur: "", kmf: "", label: "", operator: "hury", popular: false, promo: false, active: true, orderIndex: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/store/${SLUG}/admin/recharge-plans/${editingId}`, formData);
        showNotification("Forfait modifié avec succès.");
      } else {
        await api.post(`/store/${SLUG}/admin/recharge-plans`, formData);
        showNotification("Forfait ajouté avec succès.");
      }
      handleCancel();
      fetchPlans();
    } catch (err) {
      console.error(err);
      showNotification("Erreur lors de l'enregistrement du forfait.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce forfait ?")) return;
    try {
      await api.delete(`/store/${SLUG}/admin/recharge-plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
      showNotification("Erreur lors de la suppression.", "error");
    }
  };

  const toggleActive = async (plan) => {
    try {
      await api.put(`/store/${SLUG}/admin/recharge-plans/${plan.id}`, { active: !plan.active });
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Chargement des forfaits...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, color: "var(--forest-dark)" }}>
          <PhoneCall size={24} /> Gestion des Recharges Mobiles
        </h2>
      </div>

      <div style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid var(--line)", marginBottom: 30, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 16 }}>{editingId ? "Modifier un forfait" : "Créer un nouveau forfait"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, alignItems: "end" }}>
          <div>
            <label className="bs-label">Opérateur</label>
            <select className="bs-input" value={formData.operator} onChange={e => setFormData({ ...formData, operator: e.target.value })}>
              <option value="hury">Comores Telecom (Huri)</option>
              <option value="telma">YAS (Telma)</option>
            </select>
          </div>
          <div>
            <label className="bs-label">Prix Client (€)</label>
            <input type="number" step="0.01" className="bs-input" required value={formData.eur} onChange={e => setFormData({ ...formData, eur: parseFloat(e.target.value) })} />
          </div>
          <div>
            <label className="bs-label">Valeur Destinataire (KMF)</label>
            <input type="number" className="bs-input" required value={formData.kmf} onChange={e => setFormData({ ...formData, kmf: parseInt(e.target.value) })} />
          </div>
          
          <div style={{ display: "flex", gap: 16, alignItems: "center", height: 42 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <input type="checkbox" checked={formData.popular} onChange={e => setFormData({ ...formData, popular: e.target.checked })} />
              <TrendingUp size={16} color="#F59E0B" /> Populaire
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <input type="checkbox" checked={formData.promo} onChange={e => setFormData({ ...formData, promo: e.target.checked })} />
              <Tag size={16} color="#E11D48" /> Promo
            </label>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {editingId && (
              <button type="button" onClick={handleCancel} className="bs-btn bs-btn-outline" style={{ flex: 1, padding: "0 12px", height: 42 }}>
                <X size={16} /> Annuler
              </button>
            )}
            <button type="submit" className="bs-btn bs-btn-primary" style={{ flex: 2, padding: "0 12px", height: 42 }}>
              <Save size={16} style={{ marginRight: 6 }} /> {editingId ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--line)", overflow: "hidden" }}>
        <table className="bs-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Ordre</th>
              <th>Opérateur</th>
              <th>Prix (€)</th>
              <th>Crédit (KMF)</th>
              <th>Badges</th>
              <th>Statut</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p.id}>
                <td>{p.orderIndex || 0}</td>
                <td>
                  {p.operator === "hury" ? (
                    <span style={{ background: "#E0F2FE", color: "#0284C7", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Huri</span>
                  ) : (
                    <span style={{ background: "#FFE4E6", color: "#E11D48", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Telma</span>
                  )}
                </td>
                <td style={{ fontWeight: 800 }}>{p.eur.toFixed(2)} €</td>
                <td style={{ fontWeight: 800, color: "var(--forest-dark)" }}>{p.kmf.toLocaleString()} KMF</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {p.popular && <span style={{ background: "#FEF3C7", color: "#D97706", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 800 }}>POPULAIRE</span>}
                    {p.promo && <span style={{ background: "#FFE4E6", color: "#E11D48", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 800 }}>PROMO</span>}
                  </div>
                </td>
                <td>
                  <button 
                    onClick={() => toggleActive(p)}
                    style={{ 
                      background: p.active ? "#DCFCE7" : "#F1F5F9", 
                      color: p.active ? "#166534" : "#64748B",
                      border: "none", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}>
                    {p.active ? "Actif" : "Inactif"}
                  </button>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button onClick={() => handleEdit(p)} className="bs-btn-icon" title="Modifier">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="bs-btn-icon" style={{ color: "#EF4444" }} title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 30, color: "var(--muted)" }}>Aucun forfait configuré.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {notification && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: notification.type === "error" ? "#EF4444" : "#10B981",
          color: "#fff",
          padding: "14px 24px",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          fontWeight: 600,
          fontSize: 14,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          {notification.msg}
        </div>
      )}
    </div>
  );
}
