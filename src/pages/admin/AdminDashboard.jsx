import { useMemo } from "react";
import { useBooks } from "../../context/BookContext";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function StatCard({ icon, label, value, color, change, trend, progress }) {
  return (
    <div className="adm-stat-card">
      <div className="stat-glow" style={{ background: `radial-gradient(circle, ${color === "purple" ? "#7c3aed" : color === "green" ? "#22c55e" : color === "blue" ? "#3b82f6" : color === "amber" ? "#f59e0b" : color === "red" ? "#ef4444" : "#14b8a6"} 0%, transparent 70%)` }} />
      <div className="stat-top">
        <div className={`stat-icon-wrap ${color}`}>
          <span>{icon}</span>
        </div>
        <span className={`stat-change ${trend >= 0 ? "up" : "down"}`}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      </div>
      <div className="stat-body">
        <span className="stat-num">{value}</span>
        <span className="stat-lbl">{label}</span>
      </div>
      {progress !== undefined && (
        <div className="stat-progress">
          <div className="stat-progress-bar" style={{ width: `${progress}%`, background: color === "purple" ? "#7c3aed" : color === "green" ? "#22c55e" : color === "blue" ? "#3b82f6" : "#f59e0b" }} />
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { books, categories } = useBooks();
  const totalBooks = books.length;
  const totalStock = books.reduce((s, b) => s + b.stock, 0);
  const totalValue = books.reduce((s, b) => s + b.price * b.stock, 0);
  const lowStock = books.filter(b => b.stock < 20).length;
  const featured = books.filter(b => b.featured).length;
  const avgPrice = totalBooks ? (books.reduce((s, b) => s + b.price, 0) / totalBooks) : 0;

  const catData = useMemo(() => {
    const map = {};
    books.forEach(b => { map[b.category] = (map[b.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [books]);

  const barMax = useMemo(() => Math.max(...catData.map(([, c]) => c), 1), [catData]);

  const recentBooks = [...books].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-sub">Your bookstore at a glance</p>
        </div>
      </div>

      <div className="adm-stats">
        <StatCard icon="📚" label="Total Books" value={totalBooks} color="purple" trend={12} progress={75} />
        <StatCard icon="📦" label="Units in Stock" value={totalStock} color="green" trend={8} progress={65} />
        <StatCard icon="💰" label="Inventory Value" value={`$${totalValue.toLocaleString()}`} color="blue" trend={-3} progress={40} />
        <StatCard icon="⚠️" label="Low Stock Items" value={lowStock} color="red" trend={-5} progress={lowStock > 5 ? 80 : 30} />
        <StatCard icon="⭐" label="Featured Books" value={featured} color="amber" trend={0} progress={(featured / Math.max(totalBooks, 1)) * 100} />
        <StatCard icon="📊" label="Avg. Price" value={`$${avgPrice.toFixed(2)}`} color="teal" trend={2} progress={50} />
      </div>

      <div className="adm-grid two">
        <div className="adm-card">
          <div className="adm-card-header">
            <h3>Books by Category</h3>
          </div>
          <div className="adm-chart">
            {catData.map(([cat, count]) => (
              <div
                key={cat}
                className="adm-chart-bar"
                style={{ height: `${(count / barMax) * 100}%`, background: "linear-gradient(180deg, #7c3aed, #a78bfa)" }}
              >
                <div className="bar-tooltip">{count} books</div>
              </div>
            ))}
          </div>
          <div className="adm-chart-labels">
            {catData.map(([cat]) => (
              <span key={cat}>{cat.slice(0, 4)}</span>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-header">
            <h3>Recent Books</h3>
            <a href="/admin/books" className="adm-link">View All</a>
          </div>
          <div className="adm-list">
            {recentBooks.map(b => (
              <div className="adm-list-item" key={b.id}>
                <img src={b.cover} alt={b.title} />
                <div className="item-info">
                  <span className="item-title">{b.title}</span>
                  <span className="item-sub">{b.author}</span>
                </div>
                <div className="item-right">
                  <div className="item-price">${b.price.toFixed(2)}</div>
                  <span className={`item-stock ${b.stock < 20 ? "low" : "ok"}`}>{b.stock} left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="adm-grid three" style={{ marginTop: 24 }}>
        <div className="adm-card">
          <div className="adm-card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="adm-quick-actions">
            <a href="/admin/books?action=add" className="adm-quick-action">
              <span className="qa-icon purple">📖</span>
              Add New Book
              <span className="qa-arrow">→</span>
            </a>
            <a href="/admin/orders" className="adm-quick-action">
              <span className="qa-icon blue">📦</span>
              View Orders
              <span className="qa-arrow">→</span>
            </a>
            <a href="/admin/users" className="adm-quick-action">
              <span className="qa-icon green">👥</span>
              Manage Users
              <span className="qa-arrow">→</span>
            </a>
            <a href="/" className="adm-quick-action">
              <span className="qa-icon amber">🏪</span>
              View Store
              <span className="qa-arrow">→</span>
            </a>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-header">
            <h3>Category Breakdown</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {catData.map(([cat, count]) => {
              const pct = ((count / totalBooks) * 100).toFixed(0);
              return (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 4 }}>
                    <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <span>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,.04)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: 4, transition: "width .8s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-header">
            <h3>Stock Status</h3>
          </div>
          <div className="adm-quick-actions" style={{ gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Healthy Stock (&gt;50)</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>{books.filter(b => b.stock >= 50).length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Medium (20-50)</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24" }}>{books.filter(b => b.stock >= 20 && b.stock < 50).length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Low Stock (&lt;20)</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#f87171" }}>{lowStock}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
