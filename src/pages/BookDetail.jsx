import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useBooks } from "../context/BookContext";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";

export default function BookDetail() {
  const { id } = useParams();
  const { books, getBook } = useBooks();
  const book = getBook(id);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addReview, getApprovedReviews } = useAdmin();
  const { isAuthenticated, user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!book) {
    return (
      <div className="page not-found">
        <h1>Book Not Found</h1>
        <p>The book you're looking for doesn't exist.</p>
        <Link to="/catalog" className="btn btn-primary">Browse Books</Link>
      </div>
    );
  }

  const relatedBooks = book ? books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4) : [];
  const reviews = getApprovedReviews(book.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(book);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    addReview({
      bookId: book.id,
      book: book.title,
      user: user?.name || "Anonymous",
      rating: reviewRating,
      text: reviewText,
    });
    setReviewText("");
    setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="book-detail-page">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/catalog">Books</Link>
          <span>/</span>
          <Link to={`/catalog?category=${book.category}`}>{book.category}</Link>
          <span>/</span>
          <span>{book.title}</span>
        </nav>

        <div className="book-detail">
          <div className="book-detail-image">
            <img src={book.cover} alt={book.title} />
          </div>

          <div className="book-detail-info">
            <span className="book-category-label">{book.category}</span>
            <h1>{book.title}</h1>
            <p className="book-author-lg">by <Link to={`/catalog?search=${encodeURIComponent(book.author)}`}>{book.author}</Link></p>

            <div className="book-rating-lg">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < Math.floor(book.rating) ? "filled" : i < book.rating ? "half" : ""}`}>★</span>
                ))}
              </div>
              <span className="rating-num">{book.rating}</span>
              <span className="review-count">({book.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div className="book-prices-lg">
              <span className="current-price-lg">${book.price.toFixed(2)}</span>
              {book.originalPrice && (
                <>
                  <span className="original-price-lg">${book.originalPrice.toFixed(2)}</span>
                  <span className="discount-badge">Save ${(book.originalPrice - book.price).toFixed(2)}</span>
                </>
              )}
            </div>

            <p className="book-description">{book.description}</p>

            <div className="book-meta">
              <div className="meta-item"><strong>Publisher:</strong> {book.publisher}</div>
              <div className="meta-item"><strong>ISBN:</strong> {book.isbn}</div>
              <div className="meta-item"><strong>Pages:</strong> {book.pages}</div>
              <div className="meta-item"><strong>Language:</strong> {book.language}</div>
              <div className="meta-item"><strong>Published:</strong> {book.publicationYear}</div>
              <div className="meta-item"><strong>Formats:</strong> {book.format.join(", ")}</div>
            </div>

            <div className="book-tags">
              {book.tags.map(tag => (
                <Link key={tag} to={`/catalog?search=${encodeURIComponent(tag)}`} className="tag">{tag}</Link>
              ))}
            </div>

            <div className="book-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button
                className={`btn btn-outline ${isInWishlist(book.id) ? "active" : ""}`}
                onClick={() => toggleWishlist(book.id)}
              >
                {isInWishlist(book.id) ? "♥ In Wishlist" : "♡ Add to Wishlist"}
              </button>
            </div>

            <div className="stock-info">
              {book.stock > 20 ? (
                <span className="in-stock">✓ In Stock ({book.stock} available)</span>
              ) : book.stock > 0 ? (
                <span className="low-stock">⚠ Only {book.stock} left in stock</span>
              ) : (
                <span className="out-of-stock">✕ Out of Stock</span>
              )}
            </div>
          </div>
        </div>

        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <strong style={{ fontSize: 15 }}>{r.user}</strong>
                      <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>{r.date}</span>
                    </div>
                    <span style={{ color: "#f59e0b", fontWeight: 600 }}>{'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>"{r.text}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#94a3b8", marginBottom: 24 }}>No reviews yet. Be the first to review!</p>
          )}

          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Write a Review</h3>
              {reviewSubmitted && <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 14 }}>✓ Review submitted for moderation!</div>}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Rating</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(r => (
                    <span key={r} onClick={() => setReviewRating(r)} style={{ fontSize: 28, cursor: "pointer", color: r <= reviewRating ? "#f59e0b" : "#cbd5e1", transition: "color .2s" }}>★</span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Your Review</label>
                <textarea rows="3" value={reviewText} onChange={e => setReviewText(e.target.value)} required placeholder="Share your thoughts about this book..." style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14 }} />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          ) : (
            <p style={{ color: "#94a3b8" }}><Link to="/login" style={{ color: "#7c3aed", fontWeight: 600 }}>Sign in</Link> to write a review</p>
          )}
        </section>

        {relatedBooks.length > 0 && (
          <section className="related-books">
            <h2>Related Books</h2>
            <div className="books-grid">
              {relatedBooks.map(b => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
