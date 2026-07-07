import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSwipeable } from "react-swipeable";

function SwipeableCartItem({ item, onRemove, UpdateQty }) {
  const [swiping, setSwiping] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const threshold = window.innerWidth < 768 ? 60 : 999;

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (e.deltaX < -20) {
        setSwiping(true);
        setOffsetX(Math.max(e.deltaX, -threshold));
      }
    },
    onSwipedLeft: () => {
      if (offsetX <= -threshold * 0.5) {
        onRemove(item.id);
      }
      setSwiping(false);
      setOffsetX(0);
    },
    onSwiped: () => {
      setSwiping(false);
      setOffsetX(0);
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 10,
  });

  return (
    <div className="swipe-item-wrap" {...handlers}>
      <div className="swipe-delete-bg">
        <span>Delete</span>
      </div>
      <div className={`cart-item${swiping ? " swipe-item" : ""}`} style={swiping ? { transform: `translateX(${offsetX}px)` } : undefined}>
        <Link to={`/book/${item.id}`} className="cart-item-img">
          <img src={item.cover} alt={item.title} />
        </Link>
        <div className="cart-item-info">
          <Link to={`/book/${item.id}`} className="cart-item-title">{item.title}</Link>
          <p className="cart-item-author">by {item.author}</p>
          <p className="cart-item-price">${item.price.toFixed(2)} each</p>
        </div>
        <div className="cart-item-qty">
          <button onClick={() => UpdateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
          <span>{item.quantity}</span>
          <button onClick={() => UpdateQty(item.id, item.quantity + 1)}>+</button>
        </div>
        <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
        <button className="cart-item-remove" onClick={() => onRemove(item.id)} aria-label="Remove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, subtotal, shipping, discount, total, coupon, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [, setCouponApplied] = useState(false);

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === "WELCOME10" || couponInput.toUpperCase() === "AFRICA10") {
      applyCoupon(couponInput.toUpperCase());
      setCouponApplied(true);
      setCouponInput("");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponApplied(false);
  };

  if (items.length === 0) {
    return (
      <div className="page empty-page">
        <div className="container">
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any books yet.</p>
            <Link to="/catalog" className="btn btn-primary">Browse Books</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="cart-page">
      <div className="page-hero">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
        </div>
      </div>
      <div className="container">

        <div className="cart-layout">
          <div className="cart-items" style={{overflow:"hidden",borderRadius:"12px"}}>
            {items.map(item => <SwipeableCartItem key={item.id} item={item} onRemove={removeFromCart} UpdateQty={updateQuantity} />)}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            {coupon && (
              <div className="summary-row discount">
                <span>Discount (10%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="coupon-section">
              {coupon ? (
                <div className="applied-coupon">
                  <span>Code: <strong>{coupon}</strong></span>
                  <button onClick={handleRemoveCoupon}>✕</button>
                </div>
              ) : (
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button onClick={handleApplyCoupon}>Apply</button>
                </div>
              )}
              <p className="coupon-hint">Try: WELCOME10 or AFRICA10</p>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-block">Proceed to Checkout</Link>
            <Link to="/catalog" className="btn btn-secondary btn-block">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
