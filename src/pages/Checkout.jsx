import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";



export default function Checkout() {
  const { items, total, shipping, discount, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [placed, setPlaced] = useState(false);

  const [form] = useState({
    email: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setPlaced(true);
      clearCart();
    }
  };

  if (items.length === 0 && !placed) {
    navigate("/cart");
    return null;
  }

  if (placed) {
    return (
      <div className="page empty-page">
        <div className="container">
          <div className="empty-state success-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="#22c55e" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <h2>Order Placed Successfully!</h2>
            <p>Your order number is <strong>ORD-{Date.now().toString(36).toUpperCase()}</strong></p>
            <p>A confirmation email has been sent to {form.email || "your email"}.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}><span>1</span> Shipping</div>
          <div className={`step ${step >= 2 ? "active" : ""}`}><span>2</span> Payment</div>
          <div className={`step ${step >= 3 ? "active" : ""}`}><span>3</span> Review</div>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-section">
                <h2>Shipping Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input required placeholder="John" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input required placeholder="Doe" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required placeholder="john@example.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" required placeholder="+234 800 000 0000" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input required placeholder="123 Main Street" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input required placeholder="Lagos" />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input required placeholder="Lagos" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input placeholder="100001" />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select defaultValue="Nigeria">
                      <option>Nigeria</option>
                      <option>Kenya</option>
                      <option>Ghana</option>
                      <option>South Africa</option>
                      <option>Tanzania</option>
                      <option>Uganda</option>
                      <option>Ethiopia</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" defaultChecked />
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <p>Visa, Mastercard, Amex</p>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <div>
                      <strong>PayPal</strong>
                      <p>Pay with your PayPal account</p>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <div>
                      <strong>Mobile Money</strong>
                      <p>M-Pesa, Airtel Money, MTN Mobile</p>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <div>
                      <strong>Bank Transfer</strong>
                      <p>Direct bank deposit</p>
                    </div>
                  </label>
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input placeholder="4242 4242 4242 4242" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-section">
                <h2>Review Your Order</h2>
                <div className="review-items">
                  {items.map(item => (
                    <div className="review-item" key={item.id}>
                      <img src={item.cover} alt={item.title} />
                      <div>
                        <strong>{item.title}</strong>
                        <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <span>${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Edit Shipping</button>
                  <button type="submit" className="btn btn-primary btn-lg">Place Order — ${total.toFixed(2)}</button>
                </div>
              </div>
            )}

            {step < 3 && (
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => step > 1 ? setStep(step - 1) : navigate("/cart")}>
                  {step > 1 ? "Back" : "Back to Cart"}
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  {step === 1 ? "Continue to Payment" : "Review Order"}
                </button>
              </div>
            )}
          </form>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {items.map(item => (
              <div className="summary-item" key={item.id}>
                <span>{item.title.substring(0, 30)}... ×{item.quantity}</span>
                <span>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            {discount > 0 && <div className="summary-row"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
            <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
