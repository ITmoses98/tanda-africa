import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useBooks } from "../context/BookContext";
import BookCard from "../components/BookCard";

export default function Wishlist() {
  const { items, clearWishlist } = useWishlist();
  const { books } = useBooks();
  const wishlistBooks = books.filter(b => items.includes(b.id));

  if (wishlistBooks.length === 0) {
    return (
      <div className="page empty-page">
        <div className="container">
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <h2>Your Wishlist is Empty</h2>
            <p>Save your favorite books for later.</p>
            <Link to="/catalog" className="btn btn-primary">Browse Books</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="page-hero">
        <div className="container">
          <h1>My Wishlist</h1>
          <p>{wishlistBooks.length} saved book{wishlistBooks.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="container">
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
          <button className="btn-link" onClick={clearWishlist}>Clear All</button>
        </div>
        <div className="books-grid">
          {wishlistBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
