import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

export default function AdminReviews() {
  const { reviews, approveReview, rejectReview } = useAdmin();
  const [filter, setFilter] = useState("");

  const filtered = filter ? reviews.filter(r => r.status === filter) : reviews;
  const avgRating = (reviews.filter(r => r.status === "Approved").reduce((s, r) => s + r.rating, 0) / Math.max(reviews.filter(r => r.status === "Approved").length, 1)).toFixed(1);

  return (
    <div className="adm-page">
      <div className="adm-header">
        <div>
          <h1>Manage Reviews</h1>
          <p className="page-sub">{reviews.length} total · {reviews.filter(r => r.status === "Pending").length} pending · {avgRating} avg rating</p>
        </div>
        <div className="adm-filter-tabs">
          {["", "Approved", "Pending", "Rejected"].map(s => (
            <button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
              {s || "All"} ({s ? reviews.filter(r => r.status === s).length : reviews.length})
            </button>
          ))}
        </div>
      </div>

      <div className="adm-stats" style={{ marginBottom: 24 }}>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap amber">⭐</div></div>
          <div className="stat-body"><span className="stat-num">{avgRating}</span><span className="stat-lbl">Avg Rating</span></div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap green">✅</div></div>
          <div className="stat-body"><span className="stat-num">{reviews.filter(r => r.status === "Approved").length}</span><span className="stat-lbl">Approved</span></div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap amber">⏳</div></div>
          <div className="stat-body"><span className="stat-num">{reviews.filter(r => r.status === "Pending").length}</span><span className="stat-lbl">Pending</span></div>
        </div>
        <div className="adm-stat-card">
          <div className="stat-top"><div className="stat-icon-wrap red">🚫</div></div>
          <div className="stat-body"><span className="stat-num">{reviews.filter(r => r.status === "Rejected").length}</span><span className="stat-lbl">Rejected</span></div>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Review</th>
              <th>Book</th>
              <th>User</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7"><div className="adm-empty"><div className="empty-icon">💬</div><h3>No reviews found</h3></div></td></tr>
            ) : filtered.map(r => (
              <tr key={r.id}>
                <td style={{ maxWidth: 240 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>"{r.text}"</div>
                </td>
                <td style={{ color: "rgba(255,255,255,.7)" }}>{r.book}</td>
                <td>{r.user}</td>
                <td><span style={{ color: "#fbbf24", fontWeight: 600 }}>{'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></td>
                <td style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>{r.date}</td>
                <td><span className={`adm-badge ${r.status === "Approved" ? "green" : r.status === "Pending" ? "amber" : "red"}`}>{r.status}</span></td>
                <td style={{ textAlign: "right" }}>
                  <div className="adm-table-actions" style={{ justifyContent: "flex-end" }}>
                    {r.status !== "Approved" && <button className="adm-btn-sm" style={{ color: "#4ade80" }} onClick={() => approveReview(r.id)} title="Approve">✓</button>}
                    {r.status !== "Rejected" && <button className="adm-btn-sm danger" onClick={() => rejectReview(r.id)} title="Reject">✕</button>}
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
