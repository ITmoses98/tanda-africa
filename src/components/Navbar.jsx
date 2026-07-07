import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container">
          <span className="tagline">Africa's Premier Online Bookstore</span>
          <div className="navbar-top-links">
            <Link to="/help">Help</Link>
            <Link to="/seller">Sell With Us</Link>
          </div>
        </div>
      </div>

      <div className="navbar-main">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-icon">R</span>
            <div className="logo-text">
              <span className="logo-name">Tanda Africa</span>
              <span className="logo-sub">Bookstore</span>
            </div>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </form>

          <div className="navbar-actions">
            <Link to="/wishlist" className="action-btn" aria-label="Wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
            </Link>

            <Link to="/cart" className="action-btn" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </Link>

            <div className="account-menu-trigger" onClick={() => setAccountMenu(!accountMenu)}>
              {isAuthenticated ? (
                <div className="avatar-small">
                  <img src={user.avatar} alt={user.name} />
                </div>
              ) : (
                <button className="action-btn" aria-label="Account">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
              )}
              {accountMenu && (
                <div className="account-dropdown">
                  {isAuthenticated ? (
                    <>
                      <div className="dropdown-header">Hi, {user.name}</div>
                      <Link to="/account" onClick={() => setAccountMenu(false)}>My Account</Link>
                      <Link to="/orders" onClick={() => setAccountMenu(false)}>My Orders</Link>
                      <Link to="/wishlist" onClick={() => setAccountMenu(false)}>Wishlist</Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setAccountMenu(false)} className="admin-link">⚙️ Admin Panel</Link>
                      )}
                      <hr />
                      <button onClick={() => { logout(); setAccountMenu(false); }} className="dropdown-btn">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setAccountMenu(false)}>Sign In</Link>
                      <Link to="/register" onClick={() => setAccountMenu(false)}>Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button className="action-btn" onClick={toggleTheme} aria-label="Toggle theme" title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <nav className={`navbar-nav ${menuOpen ? "open" : ""}`}>
        <div className="container">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/catalog" onClick={() => setMenuOpen(false)}>Browse Books</Link>
          <Link to="/catalog?category=novels" onClick={() => setMenuOpen(false)}>Novels</Link>
          <Link to="/catalog?category=academic" onClick={() => setMenuOpen(false)}>Textbooks</Link>
          <Link to="/catalog?category=children" onClick={() => setMenuOpen(false)}>Children's Books</Link>
          <Link to="/catalog?category=religious" onClick={() => setMenuOpen(false)}>Religious</Link>
          <Link to="/catalog?category=professional" onClick={() => setMenuOpen(false)}>Professional</Link>
          <Link to="/seller" onClick={() => setMenuOpen(false)}>Sell/Publish</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      </nav>
    </header>
  );
}
