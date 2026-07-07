import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="page contact-page">
      <div className="container">
        <div className="page-hero">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Headquarters</h3>
                <p>42 Allen Avenue, Ikeja,<br />Lagos, Nigeria</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+234 800 RANDER (726337)<br />+234 1 234 5678</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>support@tandaafrica.com<br />sales@tandaafrica.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🕐</div>
              <div>
                <h3>Hours</h3>
                <p>Mon - Fri: 8:00 AM - 6:00 PM WAT<br />Sat: 9:00 AM - 4:00 PM WAT</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {sent ? (
              <div className="success-message">
                <h3>✓ Message Sent!</h3>
                <p>We'll get back to you within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => setSent(false)}>Send Another</button>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input required placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" required placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select required>
                    <option value="">Select a topic</option>
                    <option>Order Inquiry</option>
                    <option>Shipping Question</option>
                    <option>Return & Refund</option>
                    <option>Seller Support</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="5" required placeholder="Describe your inquiry..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
