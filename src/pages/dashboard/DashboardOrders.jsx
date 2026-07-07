import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";

export default function DashboardOrders() {
  const { orders, updateOrderStatus } = useAdmin();
  const { user } = useAuth();
  const [filter, setFilter] = useState("");

  const userOrders = orders.filter(o => o.email === user.email);
  const filtered = filter ? userOrders.filter(o => o.status === filter) : userOrders;

  const statuses = ["", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1>My Orders</h1>
          <p className="dash-sub">{userOrders.length} order{userOrders.length !== 1 ? "s" : ""} placed</p>
        </div>
      </div>

      <div className="dash-tabs">
        {statuses.map(s => (
          <button key={s} className={`dash-tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
            {s || "All"} ({s ? userOrders.filter(o => o.status === s).length : userOrders.length})
          </button>
        ))}
      </div>

      <div className="dash-order-list">
        {filtered.length === 0 ? (
          <div className="dash-empty">
            <span style={{ fontSize: 40 }}>📦</span>
            <h3>No orders found</h3>
            <p>Start shopping to see your orders here.</p>
          </div>
        ) : filtered.map(order => {
          const dotColor = order.status === "Delivered" ? "#4ade80" : order.status === "Shipped" ? "#60a5fa" : order.status === "Processing" ? "#fbbf24" : order.status === "Pending" ? "#94a3b8" : "#f87171";
          return (
            <div key={order.id} className="dash-order-card">
              <div className="dash-order-top">
                <div>
                  <strong className="dash-order-id">{order.id}</strong>
                  <span className="dash-order-date">{order.date}</span>
                </div>
                <span className="dash-order-total">${order.total.toFixed(2)}</span>
              </div>
              <div className="dash-order-mid">
                <span>{order.items} item{order.items > 1 ? "s" : ""} · {order.payment}</span>
                <span className="dash-track-status">
                  <span className="dash-dot" style={{ background: dotColor }} />
                  {order.status}
                </span>
              </div>
              <div className="dash-order-actions">
                {order.status === "Pending" && (
                  <button className="dash-btn tiny" onClick={() => updateOrderStatus(order.id, "Cancelled")}>Cancel Order</button>
                )}
                {order.status === "Delivered" && (
                  <button className="dash-btn tiny">Request Return</button>
                )}
                <button className="dash-btn tiny">Download Invoice</button>
                <button className="dash-btn tiny">Reorder</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
