import { useState } from "react";

const sample = [
  { id: 1, name: "David Kamau", email: "david@example.com", store: "Kenya Book Hub", status: "Active", joined: "2024-06-01", books: 12, sales: 45, revenue: 890.50, approved: true },
  { id: 2, name: "Fatima Diallo", email: "fatima@example.com", store: "Senegal Reads", status: "Pending", joined: "2026-06-15", books: 0, sales: 0, revenue: 0, approved: false },
  { id: 3, name: "Chidi Okonkwo", email: "chidi@example.com", store: "Naija Books", status: "Active", joined: "2025-11-20", books: 8, sales: 23, revenue: 412.75, approved: true },
  { id: 4, name: "Amina Said", email: "amina.s@example.com", store: "Zanzibar Pages", status: "Suspended", joined: "2026-01-10", books: 3, sales: 7, revenue: 98.45, approved: true },
  { id: 5, name: "Kofi Mensah", email: "kofi@example.com", store: "Accra Books", status: "Pending", joined: "2026-06-28", books: 0, sales: 0, revenue: 0, approved: false },
];

export default function AdminSellers() {
  const [sellers, setSellers] = useState(sample);
  const [filter, setFilter] = useState("");

  const filtered = filter ? sellers.filter(s => s.status === filter) : sellers;

  const toggleApproval = (id) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, approved: !s.approved, status: s.approved ? "Pending" : "Active" } : s));
  };

  const toggleStatus = (id) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" } : s));
  };

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Manage Sellers</h1>
          <p className="page-sub">{sellers.length} sellers · {sellers.filter(s => s.status === "Pending").length} pending approval</p>
        </div>
        <div className="adm-filter-tabs">
          {["", "Pending", "Active", "Suspended"].map(s => (
            <button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
              {s || "All"} ({s ? sellers.filter(x => x.status === s).length : sellers.length})
            </button>
          ))}
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Seller</th>
              <th>Store</th>
              <th>Books</th>
              <th>Sales</th>
              <th>Revenue</th>
              <th>Joined</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8"><div className="adm-empty"><div className="empty-icon">🏪</div><h3>No sellers found</h3></div></td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div className="td-user">
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(34,197,94,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#4ade80", fontWeight: 700 }}>{s.name.charAt(0)}</div>
                    <div><strong>{s.name}</strong><span>{s.email}</span></div>
                  </div>
                </td>
                <td style={{ color: "rgba(255,255,255,.7)" }}>{s.store}</td>
                <td>{s.books}</td>
                <td>{s.sales}</td>
                <td style={{ fontWeight: 600, color: "rgba(255,255,255,.8)" }}>${s.revenue.toFixed(2)}</td>
                <td style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>{s.joined}</td>
                <td>
                  <span className={`adm-status`}>
                    <span className={`dot ${s.status === "Active" ? "green" : s.status === "Pending" ? "amber" : "red"}`} />
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="adm-table-actions" style={{ justifyContent: "flex-end" }}>
                    {!s.approved && (
                      <button className="adm-btn-sm" style={{ color: "#4ade80" }} onClick={() => toggleApproval(s.id)} title="Approve">✓</button>
                    )}
                    {s.approved && s.status === "Suspended" && (
                      <button className="adm-btn-sm" style={{ color: "#4ade80" }} onClick={() => toggleStatus(s.id)} title="Reactivate">↻</button>
                    )}
                    {s.approved && s.status === "Active" && (
                      <button className="adm-btn-sm danger" onClick={() => toggleStatus(s.id)} title="Suspend">⛔</button>
                    )}
                    {!s.approved && (
                      <button className="adm-btn-sm danger" onClick={() => toggleApproval(s.id)} title="Reject">✕</button>
                    )}
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
