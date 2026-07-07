import { useState } from "react";

const emptyZone = { name: "", regions: "", baseRate: "", freeThreshold: "", estimatedDays: "" };

export default function AdminShipping() {
  const [zones, setZones] = useState([
    { id: 1, name: "Nigeria", regions: "Lagos, Abuja, Port Harcourt, Ibadan, Kano", baseRate: 3.99, freeThreshold: 50, estimatedDays: "2-4" },
    { id: 2, name: "East Africa", regions: "Kenya, Tanzania, Uganda, Rwanda, Ethiopia", baseRate: 5.99, freeThreshold: 70, estimatedDays: "4-7" },
    { id: 3, name: "West Africa", regions: "Ghana, Ivory Coast, Senegal, Cameroon, Benin", baseRate: 5.99, freeThreshold: 70, estimatedDays: "4-7" },
    { id: 4, name: "Southern Africa", regions: "South Africa, Zambia, Zimbabwe, Botswana, Mozambique", baseRate: 6.99, freeThreshold: 80, estimatedDays: "5-8" },
    { id: 5, name: "North Africa", regions: "Egypt, Morocco, Algeria, Tunisia, Libya", baseRate: 7.99, freeThreshold: 100, estimatedDays: "6-10" },
    { id: 6, name: "International", regions: "Europe, Americas, Asia, Oceania", baseRate: 14.99, freeThreshold: 200, estimatedDays: "10-21" },
  ]);

  const [form, setForm] = useState(emptyZone);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, baseRate: parseFloat(form.baseRate), freeThreshold: parseFloat(form.freeThreshold) || 0 };
    if (editing) {
      setZones(prev => prev.map(z => z.id === editing ? { ...z, ...data } : z));
    } else {
      setZones(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setForm(emptyZone);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Manage Shipping</h1>
          <p className="page-sub">{zones.length} shipping zones configured</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          onClick={() => { setForm(emptyZone); setEditing(null); setShowForm(true); }}>+ Add Zone</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <form className="adm-form" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
            <div className="form-group">
              <label>Zone Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Regions (comma separated)</label>
              <input value={form.regions} onChange={e => setForm(p => ({ ...p, regions: e.target.value }))} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Base Rate ($)</label>
                <input type="number" step="0.01" value={form.baseRate} onChange={e => setForm(p => ({ ...p, baseRate: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Free Shipping Over ($)</label>
                <input type="number" step="0.01" value={form.freeThreshold} onChange={e => setForm(p => ({ ...p, freeThreshold: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Estimated Delivery (days)</label>
              <input value={form.estimatedDays} onChange={e => setForm(p => ({ ...p, estimatedDays: e.target.value }))} placeholder="e.g. 3-5" />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyZone); }}>Cancel</button>
              <button type="submit" className="btn-primary">{editing ? "Update" : "Add"} Zone</button>
            </div>
          </form>
        </div>
      )}

      <div className="adm-grid three">
        {zones.map(zone => (
          <div key={zone.id} className="adm-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: 0 }}>{zone.name}</h3>
              <div className="adm-table-actions">
                <button className="adm-btn-sm" onClick={() => { setForm(zone); setEditing(zone.id); setShowForm(true); }}>✏️</button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginBottom: 12, lineHeight: 1.6 }}>{zone.regions}</div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.04)", fontSize: 13 }}>
              <span style={{ color: "rgba(255,255,255,.5)" }}>Rate</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>${zone.baseRate.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.04)", fontSize: 13 }}>
              <span style={{ color: "rgba(255,255,255,.5)" }}>Free over</span>
              <span style={{ color: "#4ade80", fontWeight: 600 }}>${zone.freeThreshold.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.04)", fontSize: 13 }}>
              <span style={{ color: "rgba(255,255,255,.5)" }}>Delivery</span>
              <span style={{ color: "rgba(255,255,255,.7)", fontWeight: 600 }}>{zone.estimatedDays} days</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
