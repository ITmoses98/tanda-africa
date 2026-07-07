import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

const statuses = ["", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [filter, setFilter] = useState("");

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;
  const statusCounts = {};
  statuses.forEach(s => { if (s) statusCounts[s] = orders.filter(o => o.status === s).length; });

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Manage Orders</h1>
          <p className="page-sub">{orders.length} orders total</p>
        </div>
        <div className="adm-filter-tabs">
          {statuses.map(s => (
            <button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
              {s || "All"} {s ? `(${statusCounts[s] || 0})` : `(${orders.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8"><div className="adm-empty"><div className="empty-icon">📦</div><h3>No orders found</h3></div></td></tr>
            ) : filtered.map(order => {
              const dot = order.status === "Delivered" ? "green" : order.status === "Shipped" ? "blue" : order.status === "Processing" ? "amber" : order.status === "Pending" ? "gray" : "red";
              return (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: "rgba(255,255,255,.8)" }}>{order.id}</td>
                  <td>
                    <div className="td-user">
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(124,58,237,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#a78bfa", fontWeight: 700 }}>
                        {order.customer.charAt(0)}
                      </div>
                      <div>
                        <strong>{order.customer}</strong>
                        <span>{order.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{order.items}</td>
                  <td style={{ fontWeight: 600, color: "rgba(255,255,255,.8)" }}>${order.total.toFixed(2)}</td>
                  <td><span className="adm-badge gray">{order.payment}</span></td>
                  <td style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>{order.date}</td>
                  <td>
                    <select
                      className="adm-status-select"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ borderLeft: `3px solid ${dot === "green" ? "#4ade80" : dot === "blue" ? "#60a5fa" : dot === "amber" ? "#fbbf24" : dot === "red" ? "#f87171" : "rgba(255,255,255,.25)"}` }}
                    >
                      {statuses.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="adm-table-actions" style={{ justifyContent: "flex-end" }}>
                      <button className="adm-btn-sm" title="View Details">👁️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
