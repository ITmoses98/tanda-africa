import { Link, useSearchParams } from "react-router-dom";
import { useBooks } from "../../context/BookContext";

const TABS = [
  { key: "bestsellers", label: "Best Sellers" },
  { key: "new", label: "New Arrivals" },
  { key: "trending", label: "Trending" },
  { key: "similar", label: "Similar Books" },
];

export default function DashboardRecommendations() {
  const { books, bestsellerBooks, featuredBooks } = useBooks();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "bestsellers";

  let recs = [];
  switch (tab) {
    case "new":
      recs = [...books].sort((a, b) => b.publicationYear - a.publicationYear || b.id - a.id).slice(0, 6);
      break;
    case "trending":
      recs = [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
      break;
    case "similar":
      recs = books.filter(b => b.tags?.some(t => t.toLowerCase().includes("fiction") || t.toLowerCase().includes("africa"))).slice(0, 6);
      break;
    default:
      recs = bestsellerBooks.slice(0, 6);
  }

  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1>Recommended For You</h1>
        <p className="dash-sub">Discover your next great read</p>
      </div>

      <div className="dash-tabs" style={{ marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.key} className={`dash-tab ${tab === t.key ? "active" : ""}`} onClick={() => setParams({ tab: t.key })}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="dash-rec-grid">
        {recs.map(b => (
          <Link key={b.id} to={`/book/${b.id}`} className="dash-rec-card">
            <img src={b.cover} alt={b.title} />
            <div className="dash-rec-body">
              <h3>{b.title}</h3>
              <p>{b.author}</p>
              <div className="dash-rec-footer">
                <strong>${b.price.toFixed(2)}</strong>
                <span className="dash-rec-rating">⭐ {b.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
