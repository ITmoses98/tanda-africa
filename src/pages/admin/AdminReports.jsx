import { useState } from "react";

const monthlyData = [
  { month: "Jan", revenue: 1240, orders: 28, books: 42 },
  { month: "Feb", revenue: 1890, orders: 35, books: 51 },
  { month: "Mar", revenue: 1620, orders: 31, books: 47 },
  { month: "Apr", revenue: 2100, orders: 42, books: 63 },
  { month: "May", revenue: 1780, orders: 36, books: 55 },
  { month: "Jun", revenue: 2450, orders: 48, books: 72 },
];

const totalRev = monthlyData.reduce((s, m) => s + m.revenue, 0);
const totalOrd = monthlyData.reduce((s, m) => s + m.orders, 0);
const totalBks = monthlyData.reduce((s, m) => s + m.books, 0);
const maxRev = Math.max(...monthlyData.map(m => m.revenue));

export default function AdminReports() {
  const [range] = useState("6months");

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Sales Reports</h1>
          <p className="page-sub">Last 6 months · ${totalRev.toFixed(2)} total revenue</p>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap green">💰</div></div>
          <div className="stat-body">
            <span className="stat-num">${totalRev.toFixed(2)}</span>
            <span className="stat-lbl">Total Revenue</span>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap blue">📦</div></div>
          <div className="stat-body">
            <span className="stat-num">{totalOrd}</span>
            <span className="stat-lbl">Total Orders</span>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap purple">📚</div></div>
          <div className="stat-body">
            <span className="stat-num">{totalBks}</span>
            <span className="stat-lbl">Books Sold</span>
          </div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap amber">📊</div></div>
          <div className="stat-body">
            <span className="stat-num">${(totalRev / totalOrd).toFixed(2)}</span>
            <span className="stat-lbl">Avg. Order Value</span>
          </div>
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 24 }}>
        <div className="adm-card-header"><h3>Monthly Revenue</h3></div>
        <div className="adm-chart">
          {monthlyData.map(m => (
            <div key={m.month} className="adm-chart-bar"
              style={{ height: `${(m.revenue / maxRev) * 100}%`, background: "linear-gradient(180deg, #7c3aed, #a78bfa)" }}>
              <div className="bar-tooltip">${m.revenue}</div>
            </div>
          ))}
        </div>
        <div className="adm-chart-labels">
          {monthlyData.map(m => <span key={m.month}>{m.month}</span>)}
        </div>
      </div>

      <div className="adm-grid two">
        <div className="adm-card">
          <div className="adm-card-header"><h3>Monthly Breakdown</h3></div>
          <div className="adm-table-wrap" style={{ border: "none", background: "transparent" }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th style={{ textAlign: "right" }}>Revenue</th>
                  <th style={{ textAlign: "right" }}>Orders</th>
                  <th style={{ textAlign: "right" }}>Books</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map(m => (
                  <tr key={m.month}>
                    <td style={{ fontWeight: 600, color: "rgba(255,255,255,.7)" }}>{m.month}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "rgba(255,255,255,.8)" }}>${m.revenue}</td>
                    <td style={{ textAlign: "right" }}>{m.orders}</td>
                    <td style={{ textAlign: "right" }}>{m.books}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-header"><h3>Summary</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Best Month</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#4ade80" }}>{monthlyData.reduce((a, b) => a.revenue > b.revenue ? a : b).month} (${Math.max(...monthlyData.map(m => m.revenue))})</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Avg Monthly Revenue</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>${(totalRev / monthlyData.length).toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Avg Books per Order</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{(totalBks / totalOrd).toFixed(1)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Conversion Rate</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#60a5fa" }}>3.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
