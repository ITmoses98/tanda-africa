import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";

export default function DashboardReviews() {
  const { reviews } = useAdmin();
  const { user } = useAuth();
  const [editing, setEditing] = useState(null);

  const myReviews = reviews.filter(r => r.user === user?.name || r.user === user?.email);
  const [localReviews, setLocalReviews] = useState(myReviews);

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      setLocalReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1>My Reviews</h1>
        <p className="dash-sub">{localReviews.length} review{localReviews.length !== 1 ? "s" : ""} written</p>
      </div>

      <div className="dash-review-list">
        {localReviews.length === 0 ? (
          <div className="dash-empty">
            <span style={{ fontSize: 40 }}>💬</span>
            <h3>No reviews yet</h3>
            <p>Review books you've purchased to help other readers.</p>
          </div>
        ) : localReviews.map(r => (
          <div key={r.id} className="dash-review-card">
            <div className="dash-review-top">
              <div>
                <strong>{r.book}</strong>
                <span className="dash-review-rating">{'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <span className="dash-review-status">{r.status}</span>
            </div>
            <p className="dash-review-text">"{r.text}"</p>
            <div className="dash-review-meta">
              <span>{r.date}</span>
              <div className="dash-review-actions">
                <button className="dash-btn tiny" onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
