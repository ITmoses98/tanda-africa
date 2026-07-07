import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <span className="hero-tag">Welcome to Tanda Africa</span>
          <h1>Discover Books That <span className="highlight">Inspire</span> Change</h1>
          <p>Africa's largest online bookstore. From timeless classics to the latest bestsellers — find your next great read with us.</p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn btn-primary">Browse Books</Link>
            <Link to="/catalog?category=novels" className="btn btn-outline">Best Sellers</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Books</span></div>
            <div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Authors</span></div>
            <div className="stat"><span className="stat-num">500K+</span><span className="stat-label">Readers</span></div>
            <div className="stat"><span className="stat-num">50+</span><span className="stat-label">Countries</span></div>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600" alt="Open book" />
        </div>
      </div>
    </section>
  );
}
