import { useState } from "react";

const sample = [
  { id: "PAY-001", order: "ORD-2026-001", customer: "John Doe", amount: 42.97, method: "Card", status: "Completed", date: "2026-06-28", fee: 1.29 },
  { id: "PAY-002", order: "ORD-2026-002", customer: "Jane Smith", amount: 18.99, method: "M-Pesa", status: "Completed", date: "2026-06-27", fee: 0.57 },
  { id: "PAY-003", order: "ORD-2026-003", customer: "Amina Okafor", amount: 29.98, method: "PayPal", status: "Completed", date: "2026-06-26", fee: 0.90 },
  { id: "PAY-004", order: "ORD-2026-004", customer: "David Kamau", amount: 89.95, method: "Bank Transfer", status: "Pending", date: "2026-06-25", fee: 0 },
  { id: "PAY-005", order: "ORD-2026-005", customer: "Grace Mensah", amount: 14.99, method: "Card", status: "Refunded", date: "2026-06-24", fee: 0.45 },
  { id: "PAY-006", order: "ORD-2026-006", customer: "Samuel Osei", amount: 25.98, method: "M-Pesa", status: "Completed", date: "2026-06-23", fee: 0.78 },
];

const totalRevenue = sample.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0);
const totalFees = sample.filter(p => p.status === "Completed").reduce((s, p) => s + p.fee, 0);

export default function AdminPayments() {
  const [payments] = useState(sample);
  const [filter, setFilter] = useState("");

  const filtered = filter ? payments.filter(p => p.status === filter) : payments;

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Manage Payments</h1>
          <p className="page-sub">${totalRevenue.toFixed(2)} total collected · ${totalFees.toFixed(2)} fees</p>
        </div>
        <div className="adm-filter-tabs">
          {["", "Completed", "Pending", "Refunded"].map(s => (
            <button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
              {s || "All"} ({s ? payments.filter(p => p.status === s).length : payments.length})
            </button>
          ))}
        </div>
      </div>

      <div className="adm-stats" style={{ marginBottom: 24 }}>
        <div className="adm-stat-card">
          <div className="stat-top">
            <div className="stat-icon-wrap green">💰</div>
          </div>
          <div className="stat-body">
            <span className="stat-num">${totalRevenue.toFixed(2)}</span>
            <span className="stat-lbl">Total Revenue</span>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top">
            <div className="stat-icon-wrap blue">📊</div>
          </div>
          <div className="stat-body">
            <span className="stat-num">{payments.length}</span>
            <span className="stat-lbl">Transactions</span>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top">
            <div className="stat-icon-wrap amber">💳</div>
          </div>
          <div className="stat-body">
            <span className="stat-num">{payments.filter(p => p.status === "Completed").length}</span>
            <span className="stat-lbl">Settled</span>
          </div>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Fee</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8"><div className="adm-empty"><div className="empty-icon">💳</div><h3>No payments found</h3></div></td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, color: "rgba(255,255,255,.7)", fontSize: 12 }}>{p.id}</td>
                <td style={{ color: "rgba(255,255,255,.6)" }}>{p.order}</td>
                <td>{p.customer}</td>
                <td style={{ fontWeight: 600, color: "rgba(255,255,255,.8)" }}>${p.amount.toFixed(2)}</td>
                <td><span className="adm-badge gray">{p.method}</span></td>
                <td style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>${p.fee.toFixed(2)}</td>
                <td style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>{p.date}</td>
                <td><span className={`adm-badge ${p.status === "Completed" ? "green" : p.status === "Pending" ? "amber" : "red"}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
