import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useBooks } from "../../context/BookContext";

export default function DashboardHome() {
  const { user } = useAuth();
  const { recentlyViewed, readingProgress, loyaltyPoints, membershipLevel, membershipColors, monthlySpending, readingChallenge } = useDashboard();
  const { itemCount, items } = useCart();
  const { wishlist } = useWishlist();
  const { books, bestsellerBooks, featuredBooks } = useBooks();

  const totalSpent = monthlySpending.reduce((s, m) => s + m.amount, 0);
  const maxSpend = Math.max(...monthlySpending.map(m => m.amount), 1);
  const recentBooks = recentlyViewed.slice(0, 4);
  const recommendations = bestsellerBooks.slice(0, 4);

  return (
    <div className="dash-page">
      <div className="dash-welcome">
        <div>
          <h1>Welcome back, {user?.name?.split(" ")[0] || "Reader"}!</h1>
          <p>Here's what's happening with your books today.</p>
        </div>
        <div className="dash-tier-badge" style={{ borderColor: membershipColors[membershipLevel] }}>
          <span className="dash-tier-icon" style={{ color: membershipColors[membershipLevel] }}>🏆</span>
          <div>
            <span className="dash-tier-name" style={{ color: membershipColors[membershipLevel] }}>{membershipLevel}</span>
            <span className="dash-tier-label">Member</span>
          </div>
        </div>
      </div>

      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-stat-icon purple">📚</div>
          <div className="dash-stat-body">
            <span className="dash-stat-num">{wishlist?.length || 0}</span>
            <span className="dash-stat-label">Wishlist Items</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon blue">🛒</div>
          <div className="dash-stat-body">
            <span className="dash-stat-num">{itemCount}</span>
            <span className="dash-stat-label">Cart Items</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon amber">⭐</div>
          <div className="dash-stat-body">
            <span className="dash-stat-num">{loyaltyPoints}</span>
            <span className="dash-stat-label">Loyalty Points</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon green">💰</div>
          <div className="dash-stat-body">
            <span className="dash-stat-num">${totalSpent.toFixed(2)}</span>
            <span className="dash-stat-label">Total Spent</span>
          </div>
        </div>
      </div>

      <div className="dash-grid two">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Monthly Spending</h3>
          </div>
          <div className="dash-chart">
            {monthlySpending.map(m => (
              <div key={m.month} className="dash-chart-bar"
                style={{ height: `${(m.amount / maxSpend) * 100}%`, background: "linear-gradient(180deg, #7c3aed, #a78bfa)" }}>
                <div className="dash-bar-tip">${m.amount}</div>
              </div>
            ))}
          </div>
          <div className="dash-chart-labels">
            {monthlySpending.map(m => <span key={m.month}>{m.month}</span>)}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Reading Challenge</h3>
            <Link to="/dashboard/library" className="dash-link">View Library</Link>
          </div>
          <div className="dash-challenge">
            <div className="dash-challenge-circle">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#7c3aed" strokeWidth="8" strokeDasharray={`${(readingChallenge.completed / readingChallenge.target) * 264}, 264`} strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <div className="dash-challenge-center">
                <span className="dash-challenge-num">{readingChallenge.completed}</span>
                <span className="dash-challenge-of">of {readingChallenge.target}</span>
              </div>
            </div>
            <p className="dash-challenge-label">Books Read This Year</p>
            <p className="dash-challenge-sub">{readingChallenge.target - readingChallenge.completed} more to reach your goal!</p>
          </div>
        </div>
      </div>

      <div className="dash-grid two">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Recently Viewed</h3>
            <Link to="/dashboard/history" className="dash-link">View All</Link>
          </div>
          {recentBooks.length > 0 ? (
            <div className="dash-book-list">
              {recentBooks.map(b => (
                <Link key={b.id} to={`/book/${b.id}`} className="dash-book-item">
                  <img src={b.cover} alt={b.title} />
                  <div className="dash-book-info">
                    <span className="dash-book-title">{b.title}</span>
                    <span className="dash-book-author">{b.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,.3)", fontSize: 13, padding: 12 }}>Start browsing books to see them here.</p>
          )}
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Recommended For You</h3>
            <Link to="/dashboard/recommendations" className="dash-link">More</Link>
          </div>
          {recommendations.length > 0 ? (
            <div className="dash-book-list">
              {recommendations.map(b => (
                <Link key={b.id} to={`/book/${b.id}`} className="dash-book-item">
                  <img src={b.cover} alt={b.title} />
                  <div className="dash-book-info">
                    <span className="dash-book-title">{b.title}</span>
                    <span className="dash-book-author">${b.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,.3)", fontSize: 13, padding: 12 }}>No recommendations yet.</p>
          )}
        </div>
      </div>

      <div className="dash-promo-banner">
        <div className="dash-promo-content">
          <span className="dash-promo-tag">Weekend Sale</span>
          <h2>20% Off Everything</h2>
          <p>Use code <strong>WEEKEND20</strong> at checkout. Ends Sunday!</p>
        </div>
        <Link to="/catalog" className="dash-promo-btn">Shop Now →</Link>
      </div>

      <div className="dash-quick-actions">
        <Link to="/catalog" className="dash-qa-btn"><span>📖</span> Browse Books</Link>
        <Link to="/cart" className="dash-qa-btn"><span>🛒</span> View Cart</Link>
        <Link to="/dashboard/orders" className="dash-qa-btn"><span>📦</span> Track Orders</Link>
        <Link to="/dashboard/coupons" className="dash-qa-btn"><span>🏷️</span> Redeem Coupon</Link>
        <Link to="/dashboard/messages" className="dash-qa-btn"><span>💬</span> Contact Support</Link>
      </div>
    </div>
  );
}
