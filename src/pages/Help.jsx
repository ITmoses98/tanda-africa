import { Link } from "react-router-dom";

export default function Help() {
  return (
    <div className="page help-page">
      <div className="container">
        <div className="page-hero">
          <h1>Help Center</h1>
          <p>How can we help you today?</p>
        </div>

        <div className="help-grid">
          <Link to="/faq" className="help-card">
            <div className="help-icon">❓</div>
            <h3>FAQ</h3>
            <p>Frequently asked questions about orders, shipping, returns, and more.</p>
          </Link>
          <Link to="/contact" className="help-card">
            <div className="help-icon">✉️</div>
            <h3>Contact Us</h3>
            <p>Reach our support team via email, phone, or contact form.</p>
          </Link>
          <Link to="/shipping" className="help-card">
            <div className="help-icon">🚚</div>
            <h3>Shipping Info</h3>
            <p>Delivery options, timelines, and tracking information.</p>
          </Link>
          <Link to="/returns" className="help-card">
            <div className="help-icon">🔄</div>
            <h3>Returns & Refunds</h3>
            <p>How to return items and get your money back.</p>
          </Link>
          <Link to="/account" className="help-card">
            <div className="help-icon">👤</div>
            <h3>Account Help</h3>
            <p>Managing your account, password, and preferences.</p>
          </Link>
          <Link to="/seller" className="help-card">
            <div className="help-icon">💼</div>
            <h3>Seller Support</h3>
            <p>Resources and support for sellers and publishers.</p>
          </Link>
        </div>

        <div className="help-contact">
          <h2>Still Need Help?</h2>
          <p>Our support team is available 24/7 to assist you.</p>
          <div className="help-channels">
            <div className="channel">
              <span className="channel-icon">📞</span>
              <strong>Phone:</strong> +234 800 RANDER
            </div>
            <div className="channel">
              <span className="channel-icon">✉️</span>
              <strong>Email:</strong> support@tandaafrica.com
            </div>
            <div className="channel">
              <span className="channel-icon">💬</span>
              <strong>Live Chat:</strong> Available Mon-Fri, 8AM-6PM WAT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
