import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SwipeableHero from "../components/SwipeableHero";
import BookCard from "../components/BookCard";
import { useBooks } from "../context/BookContext";
import { testimonials as testimonialList } from "../data/testimonials";

function SwipeableBookRow({ title, books }) {
  const scrollRef = useRef(null);

  return (
    <section className="section swipe-row">
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
          <Link to="/catalog" className="view-all">View All →</Link>
        </div>
        <div className="swipe-scroll" ref={scrollRef}>
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { books, featuredBooks, bestsellerBooks, categories } = useBooks();
  const [activeTab, setActiveTab] = useState("featured");

  return (
    <>
      <SwipeableHero />

      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <Link to="/catalog" className="view-all">View All →</Link>
          </div>
          <div className="categories-grid">
            {categories.slice(0, 6).map(cat => (
              <Link to={`/catalog?category=${cat.id}`} key={cat.id} className="category-card">
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
                <span className="category-count">{cat.count} books</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Books</h2>
            <div className="tab-buttons">
              <button className={`tab-btn ${activeTab === "featured" ? "active" : ""}`} onClick={() => setActiveTab("featured")}>Featured</button>
              <button className={`tab-btn ${activeTab === "bestsellers" ? "active" : ""}`} onClick={() => setActiveTab("bestsellers")}>Best Sellers</button>
              <button className={`tab-btn ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}>New Arrivals</button>
            </div>
          </div>
          <div className="books-grid">
            {(activeTab === "featured" ? featuredBooks : activeTab === "bestsellers" ? bestsellerBooks : books.slice(0, 8)).map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      <SwipeableBookRow title="Best Sellers" books={bestsellerBooks.slice(0, 10)} />

      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over $50 across Africa</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>256-bit SSL encrypted checkout</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy, no questions asked</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Dedicated customer service team</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section deal-section">
        <div className="container">
          <div className="deal-banner">
            <div className="deal-content">
              <span className="deal-tag">Limited Time Offer</span>
              <h2>Up to 40% Off</h2>
              <p>On academic textbooks and professional development books. Gear up for success!</p>
              <Link to="/catalog?category=academic" className="btn btn-primary">Shop Textbooks</Link>
            </div>
            <div className="deal-image">
              <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400" alt="Books stack" />
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Readers Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonialList.slice(0, 3).map(t => (
              <div className="testimonial-card" key={t.id}>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < t.rating ? "filled" : ""}`}>★</span>
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-banner">
            <h2>Become a Seller or Publisher</h2>
            <p>Reach millions of readers across Africa. List your books, manage sales, and grow your publishing business.</p>
            <Link to="/seller" className="btn btn-primary">Learn More</Link>
          </div>
        </div>
      </section>
    </>
  );
}
