import { useMemo } from "react";
import { useBooks } from "../../context/BookContext";

export default function AdminAnalytics() {
  const { books, categories } = useBooks();

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const totalStock = books.reduce((s, b) => s + b.stock, 0);
    const totalValue = books.reduce((s, b) => s + b.price * b.stock, 0);
    const avgRating = (books.reduce((s, b) => s + (b.rating || 0), 0) / totalBooks).toFixed(1);
    const mostExpensive = [...books].sort((a, b) => b.price - a.price)[0];
    const topRated = [...books].sort((a, b) => b.rating - a.rating)[0];
    return { totalBooks, totalStock, totalValue, avgRating, mostExpensive, topRated };
  }, [books]);

  const byFormat = useMemo(() => {
    const map = {};
    books.forEach(b => {
      (b.format || ["Paperback"]).forEach(f => { map[f] = (map[f] || 0) + 1; });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [books]);

  const maxFormat = Math.max(...byFormat.map(([, c]) => c), 1);

  const byYear = useMemo(() => {
    const map = {};
    books.forEach(b => {
      const y = b.publicationYear || 2000;
      map[y] = (map[y] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[0] - a[0]).slice(0, 10);
  }, [books]);

  const maxYear = Math.max(...byYear.map(([, c]) => c), 1);

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-sub">Deep insights into your catalog</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap purple">⭐</div></div>
          <div className="stat-body"><span className="stat-num">{stats.avgRating}</span><span className="stat-lbl">Average Rating</span></div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap green">📚</div></div>
          <div className="stat-body"><span className="stat-num">{stats.totalStock}</span><span className="stat-lbl">Total Inventory</span></div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap blue">💰</div></div>
          <div className="stat-body"><span className="stat-num">${stats.totalValue.toFixed(0)}</span><span className="stat-lbl">Inventory Value</span></div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap amber">📈</div></div>
          <div className="stat-body"><span className="stat-num">{(stats.totalValue / stats.totalStock).toFixed(2)}</span><span className="stat-lbl">Avg Unit Value</span></div>
        </div>
      </div>

      <div className="adm-grid two" style={{ marginBottom: 24 }}>
        <div className="adm-card">
          <div className="adm-card-header"><h3>Books by Format</h3></div>
          <div className="adm-chart">
            {byFormat.map(([fmt, count]) => (
              <div key={fmt} className="adm-chart-bar"
                style={{ height: `${(count / maxFormat) * 100}%`, background: "linear-gradient(180deg, #3b82f6, #60a5fa)" }}>
                <div className="bar-tooltip">{count} books</div>
              </div>
            ))}
          </div>
          <div className="adm-chart-labels">
            {byFormat.map(([fmt]) => <span key={fmt}>{fmt.slice(0, 6)}</span>)}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-header"><h3>Top Performers</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>MOST EXPENSIVE</span>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{stats.mostExpensive?.title}</span>
                <span style={{ color: "#a78bfa", fontWeight: 700 }}>${stats.mostExpensive?.price.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>HIGHEST RATED</span>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{stats.topRated?.title}</span>
                <span style={{ color: "#fbbf24", fontWeight: 700 }}>{stats.topRated?.rating} ⭐</span>
              </div>
            </div>
            <div style={{ padding: "12px 0" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>LOWEST STOCK</span>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: "#f87171", fontSize: 14, fontWeight: 600 }}>{[...books].sort((a, b) => a.stock - b.stock)[0]?.title}</span>
                <span style={{ color: "#f87171", fontWeight: 700 }}>{[...books].sort((a, b) => a.stock - b.stock)[0]?.stock} left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="adm-grid two">
        <div className="adm-card">
          <div className="adm-card-header"><h3>Books by Publication Year</h3></div>
          <div className="adm-chart">
            {byYear.map(([year, count]) => (
              <div key={year} className="adm-chart-bar"
                style={{ height: `${(count / maxYear) * 100}%`, background: "linear-gradient(180deg, #22c55e, #4ade80)" }}>
                <div className="bar-tooltip">{count} books</div>
              </div>
            ))}
          </div>
          <div className="adm-chart-labels">
            {byYear.map(([year]) => <span key={year}>{year}</span>)}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-header"><h3>Catalog Composition</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {categories.map(cat => {
              const count = books.filter(b => b.category === cat.id).length;
              const pct = ((count / books.length) * 100).toFixed(1);
              return count > 0 ? (
                <div key={cat.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 4 }}>
                    <span>{cat.icon} {cat.name}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,.04)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: 4 }} />
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
