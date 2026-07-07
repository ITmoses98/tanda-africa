import { useState } from "react";
import PhoneInput from "../components/PhoneInput";

export default function Seller() {
  const [form, setForm] = useState({ name: "", email: "", phoneCode: "NG", phoneDial: "+234", phoneNumber: "", store: "", type: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoneChange = (val) => setForm({ ...form, phoneCode: val.code, phoneDial: val.dial, phoneNumber: val.number });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page seller-page">
      <div className="container">
        <div className="page-hero">
          <h1>Sell & Publish on Tanda Africa</h1>
          <p>Reach millions of readers across Africa and beyond</p>
        </div>

        <div className="seller-benefits">
          <div className="benefit-card">
            <div className="benefit-icon">🌍</div>
            <h3>Pan-African Reach</h3>
            <p>Sell your books to readers in 50+ countries across Africa.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📈</div>
            <h3>Grow Your Business</h3>
            <p>Access detailed analytics, sales reports, and inventory management tools.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💳</div>
            <h3>Hassle-Free Payments</h3>
            <p>Get paid securely with weekly payouts directly to your bank account or mobile money.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📖</div>
            <h3>Self-Publishing</h3>
            <p>Publish your own books with our print-on-demand service. No inventory needed.</p>
          </div>
        </div>

        <div className="seller-details">
          <section>
            <h2>For Booksellers & Distributors</h2>
            <p>List your inventory on Tanda Africa and tap into our growing customer base. We handle payment processing, customer service, and logistics — you focus on sourcing great books.</p>
            <ul>
              <li>15% commission on each sale</li>
              <li>No listing or monthly fees</li>
              <li>Real-time inventory sync</li>
              <li>Dedicated seller support team</li>
              <li>Marketing exposure through promotions and featured listings</li>
            </ul>
          </section>

          <section>
            <h2>For Authors & Publishers</h2>
            <p>Publish your books and reach readers directly. Our self-publishing platform makes it easy to get your work in front of the right audience.</p>
            <ul>
              <li>Print-on-demand and eBook distribution</li>
              <li>Higher royalties than traditional publishing</li>
              <li>Full creative control over your work</li>
              <li>Professional cover design and editing services available</li>
              <li>Marketing support for featured titles</li>
            </ul>
          </section>
        </div>

        <div className="seller-form-section">
          <h2>Apply to Become a Seller</h2>
          {submitted ? (
            <div className="success-message">
              <h3>✓ Application Submitted!</h3>
              <p>Our team will review your application within 3-5 business days. You'll receive a response at {form.email}.</p>
            </div>
          ) : (
            <form className="seller-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <PhoneInput required defaultCode="NG" onChange={handlePhoneChange} />
                </div>
                <div className="form-group">
                  <label>Store/Business Name</label>
                  <input name="store" value={form.store} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>I am a...</label>
                <select name="type" value={form.type} onChange={handleChange} required>
                  <option value="">Select one</option>
                  <option value="seller">Book Seller / Distributor</option>
                  <option value="author">Author / Writer</option>
                  <option value="publisher">Publisher</option>
                  <option value="both">Both Seller & Author</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-lg">Submit Application</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
