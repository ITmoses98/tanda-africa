import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(book.id);

  return (
    <div className="book-card">
      {book.originalPrice && (
        <span className="book-discount">
          -{Math.round((1 - book.price / book.originalPrice) * 100)}%
        </span>
      )}
      <button
        className={`wishlist-btn ${inWishlist ? "active" : ""}`}
        onClick={() => toggleWishlist(book.id)}
        aria-label="Toggle wishlist"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <Link to={`/book/${book.id}`}>
        <div className="book-card-img">
          <img src={book.cover} alt={book.title} loading="lazy" />
        </div>
      </Link>
      <div className="book-card-body">
        <span className="book-category">{book.category}</span>
        <Link to={`/book/${book.id}`} className="book-title">{book.title}</Link>
        <p className="book-author">by {book.author}</p>
        <div className="book-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.floor(book.rating) ? "filled" : i < book.rating ? "half" : ""}`}>★</span>
            ))}
          </div>
          <span className="review-count">({book.reviewCount.toLocaleString()})</span>
        </div>
        <div className="book-card-footer">
          <div className="book-prices">
            <span className="current-price">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <span className="original-price">${book.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="btn-add-cart" onClick={() => addToCart(book)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
