import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

const empty = { code: "", discount: "", type: "percentage", minOrder: "", maxUses: "", expires: "", active: true };

export default function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, toggleCoupon } = useAdmin();
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, discount: parseFloat(form.discount), minOrder: parseFloat(form.minOrder) || 0, maxUses: parseInt(form.maxUses) || 0 };
    if (editing) {
      updateCoupon({ ...data, id: editing });
    } else {
      addCoupon({ ...data, id: Date.now(), used: 0 });
    }
    setForm(empty);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Coupons & Discounts</h1>
          <p className="page-sub">{coupons.filter(c => c.active).length} active coupons</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}>+ New Coupon</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <form className="adm-form" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
            <div className="form-row">
              <div className="form-group">
                <label>Coupon Code</label>
                <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required />
              </div>
              <div className="form-group">
                <label>Discount Value</label>
                <input type="number" step="0.01" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Min Order ($)</label>
                <input type="number" step="0.01" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max Uses</label>
                <input type="number" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Expires</label>
                <input type="date" value={form.expires} onChange={e => setForm(p => ({ ...p, expires: e.target.value }))} />
              </div>
            </div>
            <div className="form-checkboxes" style={{ padding: "8px 0" }}>
              <label className="checkbox-label">
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                Active
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}>Cancel</button>
              <button type="submit" className="btn-primary">{editing ? "Update" : "Create"} Coupon</button>
            </div>
          </form>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Type</th>
              <th>Min Order</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr><td colSpan="8"><div className="adm-empty"><div className="empty-icon">🏷️</div><h3>No coupons created</h3></div></td></tr>
            ) : coupons.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700, color: "#a78bfa", fontFamily: "monospace", fontSize: 14 }}>{c.code}</td>
                <td style={{ fontWeight: 600, color: "rgba(255,255,255,.8)" }}>{c.type === "percentage" ? `${c.discount}%` : `$${c.discount.toFixed(2)}`}</td>
                <td><span className="adm-badge gray">{c.type === "percentage" ? "Percentage" : "Fixed"}</span></td>
                <td>${c.minOrder.toFixed(2)}</td>
                <td>{c.used}/{c.maxUses || "∞"}</td>
                <td style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>{c.expires}</td>
                <td>
                  <span className="adm-status">
                    <span className={`dot ${c.active ? "green" : "red"}`} />
                    {c.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="adm-table-actions" style={{ justifyContent: "flex-end" }}>
                    <button className="adm-btn-sm" onClick={() => { setForm(c); setEditing(c.id); setShowForm(true); }}>✏️</button>
                    <button className="adm-btn-sm" onClick={() => toggleCoupon(c.id)} title={c.active ? "Disable" : "Enable"}>
                      {c.active ? "⏸" : "▶️"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
